export const STORAGE_KEY = '3951-halloween-bingo:v1';
export const FREE = 'free';
export function makeCard(challenges) {
  if (challenges.length !== 24 || new Set(challenges.map(c => c.id)).size !== 24 || challenges.some(c => !c.id || c.id === FREE || !c.text)) {
    throw new Error('The card requires 24 unique challenges with IDs and text.');
  }
  return [...challenges.slice(0, 12), { id: FREE, text: 'Free space' }, ...challenges.slice(12)];
}
export const lines = [
  ...Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r * 5 + c)),
  ...Array.from({ length: 5 }, (_, c) => Array.from({ length: 5 }, (_, r) => r * 5 + c)),
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
];
export function winningLines(card, checked) {
  return lines.filter(line => line.every(i => card[i].id === FREE || checked.has(card[i].id)));
}
export function readProgress(raw, challenges) {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.checked)) return new Set();
    const valid = new Set(challenges.map(c => c.id));
    return new Set(data.checked.filter(id => valid.has(id)));
  } catch { return new Set(); }
}
export function serializeProgress(checked) {
  return JSON.stringify({ version: 1, checked: [...checked] });
}
