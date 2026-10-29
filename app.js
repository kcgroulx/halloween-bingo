import { challenges } from './challenges.js';
import { FREE, STORAGE_KEY, makeCard, winningLines, readProgress, serializeProgress } from './game.js';

const card = makeCard(challenges);
const $ = id => document.getElementById(id);
let checked = new Set();
let canSave = true;
let celebrationTimer;
try { checked = readProgress(localStorage.getItem(STORAGE_KEY), challenges); }
catch { canSave = false; }
let previousWins = new Set();
const winKey = line => line.join('-');

const tiles = card.map((challenge, index) => {
  const tile = document.createElement(challenge.id === FREE ? 'div' : 'button');
  tile.className = 'tile';
  tile.style.setProperty('--paper-position', `${-(index % 5) * 67}px ${-Math.floor(index / 5) * 67}px`);
  if (challenge.id === FREE) {
    tile.classList.add('free');
    tile.innerHTML = '<img src="./assets/bat.svg" alt=""><span>Free space</span><small>Wicked by nature</small>';
  } else {
    tile.type = 'button';
    const number = document.createElement('span');
    number.className = 'number'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
    const tick = document.createElement('span'); tick.className = 'check'; tick.textContent = '✓'; tick.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span'); label.textContent = challenge.text;
    tile.setAttribute('aria-label', challenge.text);
    tile.append(number, tick, label);
    tile.addEventListener('click', () => {
      checked.has(challenge.id) ? checked.delete(challenge.id) : checked.add(challenge.id);
      save(); render(true);
    });
  }
  $('board').append(tile);
  return tile;
});

function save() {
  try { localStorage.setItem(STORAGE_KEY, serializeProgress(checked)); canSave = true; }
  catch { canSave = false; }
}
function render(celebrate = false) {
  const wins = winningLines(card, checked);
  const winningCells = new Set(wins.flat());
  tiles.forEach((tile, i) => {
    if (card[i].id !== FREE) tile.setAttribute('aria-pressed', String(checked.has(card[i].id)));
    tile.classList.toggle('winning', winningCells.has(i));
  });
  $('deed-count').textContent = `${checked.size} / 24 deeds done`;
  $('line-count').textContent = `${wins.length} ${wins.length === 1 ? 'bingo' : 'bingos'}`;
  $('progress-fill').style.width = `${checked.size / 24 * 100}%`;
  $('storage-note').textContent = canSave ? 'Your deeds are saved on this browser.' : 'Saving is unavailable. Keep this tab open to retain your progress.';
  $('storage-note').classList.toggle('warning', !canSave);
  if (celebrate && wins.some(line => !previousWins.has(winKey(line)))) {
    clearTimeout(celebrationTimer); $('celebration').hidden = false;
    celebrationTimer = setTimeout(() => { $('celebration').hidden = true; }, 4200);
  } else if (!wins.length) { $('celebration').hidden = true; }
  previousWins = new Set(wins.map(winKey));
}
render();

$('reset').addEventListener('click', () => $('reset-dialog').showModal());
$('reset-dialog').addEventListener('close', () => {
  if ($('reset-dialog').returnValue !== 'reset') return;
  checked.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch { canSave = false; }
  clearTimeout(celebrationTimer); $('celebration').hidden = true; render();
});

const publicUrl = 'https://kcgroulx.github.io/halloween-bingo/';
$('share-url').value = publicUrl;
$('share').addEventListener('click', () => { $('copy-status').textContent = ''; $('share-dialog').showModal(); });
$('close-share').addEventListener('click', () => $('share-dialog').close());
$('copy-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(publicUrl); $('copy-status').textContent = 'Link copied. Let the mischief begin.'; }
  catch { $('share-url').focus(); $('share-url').select(); $('copy-status').textContent = 'Select and copy the link above.'; }
});
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  checked = readProgress(event.newValue, challenges); render();
});
