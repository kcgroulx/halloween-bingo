import { test } from 'node:test';
import assert from 'node:assert/strict';
import { challenges } from '../challenges.js';
import { makeCard, lines, winningLines, readProgress, serializeProgress } from '../game.js';
const card = makeCard(challenges);
test('all twelve lines win independently and can be undone', () => {
  assert.equal(lines.length, 12);
  for (const line of lines) {
    const checked = new Set(line.filter(i => i !== 12).map(i => card[i].id));
    assert.deepEqual(winningLines(card, checked), [line]);
    checked.delete(card[line.find(i => i !== 12)].id);
    assert.equal(winningLines(card, checked).length, 0);
  }
});
test('overlapping lines and a full card count correctly', () => {
  const checked = new Set([...lines[0], ...lines[5]].map(i => card[i].id));
  assert.equal(winningLines(card, checked).length, 2);
  assert.equal(winningLines(card, new Set(challenges.map(c => c.id))).length, 12);
  assert.equal(winningLines(card, new Set()).length, 0);
});
test('storage round trips, rejects invalid data and drops obsolete IDs', () => {
  const [first, second] = challenges.map(c => c.id);
  const checked = new Set([first, second]);
  assert.deepEqual(readProgress(serializeProgress(checked), challenges), checked);
  for (const raw of [null, '', '{bad', '{}', 'null', '{"version":2,"checked":["meet"]}', '{"version":1,"checked":{}}']) assert.equal(readProgress(raw, challenges).size, 0);
  assert.deepEqual(readProgress(JSON.stringify({version: 1, checked: [first, first, 'removed', 'free', null]}), challenges), new Set([first]));
  assert.deepEqual(readProgress(serializeProgress(checked), challenges.map(c => ({...c, text:'Updated'}))), checked);
});
test('card protects the free center and validates author edits', () => {
  assert.equal(card.length, 25); assert.equal(card[12].id, 'free');
  assert.throws(() => makeCard(challenges.slice(1)));
  assert.throws(() => makeCard([...challenges.slice(1), challenges[1]]));
});
