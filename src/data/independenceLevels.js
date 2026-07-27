/* 경제 자립 진단 5단계 — 학습 성장 단계(src/data/levelData.js)와는 별개 시스템.
 * "새싹/잎/꽃" 같은 식물 이름이 학습 성장 단계와 겹쳐 혼동을 줘서
 * 재무 상태를 직접 말하는 이름으로 바꿨다. label/desc는 여기서만 정의하고,
 * 화면에서는 항상 이 파일을 통해 level 키로 조회한다 — DB에 예전 이름이
 * 문자열로 저장돼 있어도(예: 기존 프로필의 independence_diagnosis.label)
 * 화면엔 항상 최신 이름이 보이도록 하기 위함이다.
 */
export const LEVELS = [
  { level: 'seed',   label: '시작하는 중',   shortLabel: '시작', desc: '재무 기초를 하나씩 익혀가고 있어요',        color: '#78909C', bg: '#ECEFF1', maxScore: 18 },
  { level: 'sprout', label: '습관 만드는 중', shortLabel: '습관', desc: '저축·지출 관리 습관을 만들어가고 있어요',   color: '#66BB6A', bg: '#E8F5E9', maxScore: 26 },
  { level: 'leaf',   label: '기반 다지는 중', shortLabel: '기반', desc: '안정적인 재무 구조를 다져가고 있어요',      color: '#26A69A', bg: '#E0F2F1', maxScore: 34 },
  { level: 'flower', label: '자산 불리는 중', shortLabel: '자산', desc: '자산을 불려나갈 기반이 잡혔어요',           color: '#AB47BC', bg: '#F3E5F5', maxScore: 42 },
  { level: 'fruit',  label: '자립 지키는 중', shortLabel: '자립', desc: '경제적 자립에 가까워지고 있어요',           color: '#FFA726', bg: '#FFF3E0', maxScore: 50 },
];

export function calculateLevel(total) {
  if (total <= 18) return LEVELS[0];
  if (total <= 26) return LEVELS[1];
  if (total <= 34) return LEVELS[2];
  if (total <= 42) return LEVELS[3];
  return LEVELS[4];
}

export function getLevelByKey(key) {
  return LEVELS.find(l => l.level === key) ?? LEVELS[0];
}
