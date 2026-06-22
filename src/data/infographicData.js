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
    { icon: 'Building2', label: '삼성전자' },
    { icon: 'Globe',     label: '애플' },
    { icon: 'Cpu',       label: '엔비디아' },
    { icon: 'Zap',       label: '테슬라' },
  ],
  result: { icon: 'Package', label: 'ETF 바구니', note: '한 번에 분산 투자' },
};

const EMERGENCY_FUND_INFOGRAPHIC = {
  type: 'flow',
  title: '비상금은 어떻게 만드나요?',
  subtitle: '내 돈이 지켜지는 순서',
  steps: [
    { icon: 'Banknote',      label: '월급 수령' },
    { icon: 'Landmark',      label: '비상금 먼저 분리', note: '생활비 × 3~6개월분' },
    { icon: 'CreditCard',    label: '남은 돈으로 생활비 사용' },
    { icon: 'AlertTriangle', label: '갑작스러운 지출 발생' },
    { icon: 'CheckCircle2',  label: '비상금으로 해결', note: '대출 없이 위기 탈출!' },
  ],
};

const DEPOSIT_INFOGRAPHIC = {
  type: 'compare',
  title: '예금 vs 적금, 뭐가 다른가요?',
  left: {
    icon: 'Wallet',
    label: '정기예금',
    color: '#3B82F6',
    points: ['목돈을 한 번에 맡김', '이자가 상대적으로 높음', '만기 전 해지 시 손해'],
  },
  right: {
    icon: 'PiggyBank',
    label: '정기적금',
    color: 'var(--c-green-500)',
    points: ['매달 나눠서 납입', '저축 습관 기르기 좋음', '목돈 없이도 시작 가능'],
  },
  note: '목돈이 있으면 예금, 저축을 시작하려면 적금',
};

const INFLATION_INFOGRAPHIC = {
  type: 'flow',
  title: '물가가 오르면 어떻게 되나요?',
  subtitle: '내 돈의 가치 변화',
  steps: [
    { icon: 'Banknote',     label: '작년엔 100만원으로 구입 가능' },
    { icon: 'TrendingUp',   label: '물가 10% 상승' },
    { icon: 'ShoppingCart', label: '올해는 90만원어치밖에 못 삼', note: '돈의 가치가 줄어들었어요' },
  ],
};

const INTEREST_RATE_INFOGRAPHIC = {
  type: 'compare',
  title: '기준금리가 오르면 어떻게 될까요?',
  left: {
    icon: 'TrendingUp',
    label: '금리 인상',
    color: '#EF4444',
    points: ['대출 이자 부담 증가', '예금·적금 이자 증가', '소비·투자 위축'],
  },
  right: {
    icon: 'TrendingDown',
    label: '금리 인하',
    color: 'var(--c-green-500)',
    points: ['대출 이자 부담 감소', '예금·적금 이자 감소', '소비·투자 활성화'],
  },
  note: '한국은행이 경제를 조율하는 핵심 도구예요',
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

// AI 생성을 트리거할 경제 개념 키워드 목록
// 명사형 개념어 위주 — 대화성 질문("요즘 경제 어때?")에는 반응하지 않도록
export const AI_INFOGRAPHIC_KEYWORDS = [
  // 투자 상품
  '주식', '채권', '펀드', '인덱스펀드', '리츠', 'reits',
  // 계좌/상품
  'cma', 'isa', 'irp', '연금저축', '파킹통장', 'mmf', '주택청약',
  // 부동산
  '전세', '월세', '청약', '주택담보대출', '전세대출', '부동산',
  // 거시경제
  '환율', '달러', '디플레이션', '경기침체', '재정정책', '통화정책', '무역수지',
  // 개인금융
  '복리', '단리', '배당', '배당금', '절세', '연말정산', '종합소득세',
  '신용점수', '신용등급', '대출', '담보', '보증',
  // 기타 개념
  '포트폴리오', '분산투자', '리밸런싱', '자산배분',
];
