/* ECONOMING 성장 단계 & XP 유틸리티 */
import { Bean, Sprout, Leaf, Flower2, Cherry, TreeDeciduous, Trees } from 'lucide-react';

export const LEVELS = [
  { key: 'seed',   label: '씨앗', emoji: '🌱', Icon: Bean,          xpRequired: 0   },
  { key: 'sprout', label: '새싹', emoji: '🌿', Icon: Sprout,        xpRequired: 20  },
  { key: 'leaf',   label: '잎',   emoji: '🍃', Icon: Leaf,          xpRequired: 50  },
  { key: 'flower', label: '꽃',   emoji: '🌸', Icon: Flower2,       xpRequired: 100 },
  { key: 'fruit',  label: '열매', emoji: '🍊', Icon: Cherry,        xpRequired: 180 },
  { key: 'tree',   label: '나무', emoji: '🌳', Icon: TreeDeciduous, xpRequired: 300 },
  { key: 'forest', label: '숲',   emoji: '🌲', Icon: Trees,         xpRequired: 500 },
];

/** XP 값으로 현재 레벨 객체 반환 */
export function getLevelByXp(xp = 0) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l;
    else break;
  }
  return current;
}

/** level key → 표시명 */
export function getLevelLabel(levelKey) {
  return LEVELS.find(l => l.key === levelKey)?.label ?? '씨앗';
}

/** level key → 이모지 */
export function getLevelIcon(levelKey) {
  return LEVELS.find(l => l.key === levelKey)?.emoji ?? '🌱';
}

/**
 * 다음 단계 정보 반환
 * @returns {{
 *   currentLevel: object,
 *   nextLevel: object|null,
 *   xpProgress: number,   // 현재 레벨 내 진행 XP
 *   xpTotal: number,      // 현재 → 다음 레벨까지 필요 총 XP
 *   xpNeeded: number,     // 다음 레벨까지 남은 XP
 *   progressPercent: number
 * }}
 */
export function getNextLevelInfo(xp = 0) {
  const currentLevel = getLevelByXp(xp);
  const currentIndex = LEVELS.findIndex(l => l.key === currentLevel.key);
  const isMaxLevel   = currentIndex === LEVELS.length - 1;

  if (isMaxLevel) {
    return {
      currentLevel,
      nextLevel:       null,
      xpProgress:      xp - currentLevel.xpRequired,
      xpTotal:         0,
      xpNeeded:        0,
      progressPercent: 100,
    };
  }

  const nextLevel       = LEVELS[currentIndex + 1];
  const xpProgress      = xp - currentLevel.xpRequired;
  const xpTotal         = nextLevel.xpRequired - currentLevel.xpRequired;
  const xpNeeded        = nextLevel.xpRequired - xp;
  const progressPercent = Math.min(100, Math.round((xpProgress / xpTotal) * 100));

  return { currentLevel, nextLevel, xpProgress, xpTotal, xpNeeded, progressPercent };
}
