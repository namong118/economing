import economicBites from '../data/economicBites';

export function getTodaysBite() {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % economicBites.length;
  return economicBites[index];
}
