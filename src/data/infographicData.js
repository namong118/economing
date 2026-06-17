// Infographic data schemas (future Solar API will return same JSON → auto-rendered)
//
// flow:       { type, title, subtitle, steps: [{ icon, label, note? }] }
// collection: { type, title, subtitle, items: [{ icon, label }], result: { icon, label, note? } }
// compare:    { type, title, left: { icon, label, color, points[] }, right: {...}, note? }

const ETF_INFOGRAPHIC = {
  type: 'collection',
  title: 'ETF가 뭔가요?',
  subtitle: '여러 주식을 하나의 바구니에',
  items: [
    { icon: '🏢', label: '삼성전자' },
    { icon: '🍎', label: '애플' },
    { icon: '🎮', label: '엔비디아' },
    { icon: '⚡', label: '테슬라' },
  ],
  result: { icon: '📦', label: 'ETF 바구니', note: '한 번에 분산 투자' },
};

const EMERGENCY_FUND_INFOGRAPHIC = {
  type: 'flow',
  title: '비상금은 어떻게 만드나요?',
  subtitle: '내 돈이 지켜지는 순서',
  steps: [
    { icon: '💵', label: '월급 수령' },
    { icon: '🏦', label: '비상금 먼저 분리', note: '생활비 × 3~6개월분' },
    { icon: '💳', label: '남은 돈으로 생활비 사용' },
    { icon: '🚨', label: '갑작스러운 지출 발생' },
    { icon: '✅', label: '비상금으로 해결', note: '대출 없이 위기 탈출!' },
  ],
};

const DEPOSIT_INFOGRAPHIC = {
  type: 'compare',
  title: '예금 vs 적금, 뭐가 다른가요?',
  left: {
    icon: '💰',
    label: '정기예금',
    color: '#3B82F6',
    points: ['목돈을 한 번에 맡김', '이자가 상대적으로 높음', '만기 전 해지 시 손해'],
  },
  right: {
    icon: '🐷',
    label: '정기적금',
    color: '#52C97A',
    points: ['매달 나눠서 납입', '저축 습관 기르기 좋음', '목돈 없이도 시작 가능'],
  },
  note: '💡 목돈이 있으면 예금, 저축을 시작하려면 적금',
};

const INFLATION_INFOGRAPHIC = {
  type: 'flow',
  title: '물가가 오르면 어떻게 되나요?',
  subtitle: '내 돈의 가치 변화',
  steps: [
    { icon: '💵', label: '작년엔 100만원으로 구입 가능' },
    { icon: '📈', label: '물가 10% 상승' },
    { icon: '🛒', label: '올해는 90만원어치밖에 못 삼', note: '돈의 가치가 줄어들었어요' },
  ],
};

const INTEREST_RATE_INFOGRAPHIC = {
  type: 'compare',
  title: '기준금리가 오르면 어떻게 될까요?',
  left: {
    icon: '📈',
    label: '금리 인상',
    color: '#EF4444',
    points: ['대출 이자 부담 증가', '예금·적금 이자 증가', '소비·투자 위축'],
  },
  right: {
    icon: '📉',
    label: '금리 인하',
    color: '#52C97A',
    points: ['대출 이자 부담 감소', '예금·적금 이자 감소', '소비·투자 활성화'],
  },
  note: '💡 한국은행이 경제를 조율하는 핵심 도구예요',
};

// Ordered by specificity (more specific keywords first)
const INFOGRAPHIC_ENTRIES = [
  { keywords: ['etf', '이티에프'], data: ETF_INFOGRAPHIC },
  { keywords: ['비상금', '비상 자금', '비상금통장'], data: EMERGENCY_FUND_INFOGRAPHIC },
  { keywords: ['예금', '적금'], data: DEPOSIT_INFOGRAPHIC },
  { keywords: ['물가', '인플레이션', '인플레'], data: INFLATION_INFOGRAPHIC },
  { keywords: ['기준금리', '금리', '이자율'], data: INTEREST_RATE_INFOGRAPHIC },
];

export function getInfographic(question) {
  const q = (question || '').toLowerCase();
  for (const entry of INFOGRAPHIC_ENTRIES) {
    if (entry.keywords.some(k => q.includes(k.toLowerCase()))) {
      return entry.data;
    }
  }
  return null;
}
