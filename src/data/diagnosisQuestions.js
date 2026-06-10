/* AI 경제 레벨 진단 질문 (5문항) */
export const diagnosisQuestions = [
  {
    id: 1,
    question: 'ETF(상장지수펀드)가 무엇인지 알고 있나요?',
    hint: '주식처럼 거래할 수 있는 펀드 상품입니다.',
    category: '투자',
    emoji: '📈',
  },
  {
    id: 2,
    question: '청약통장(주택청약종합저축)을 갖고 있나요?',
    hint: '아파트 분양에 응모할 수 있는 통장입니다.',
    category: '부동산',
    emoji: '🏠',
  },
  {
    id: 3,
    question: '연말정산을 직접 해본 적 있나요?',
    hint: '1년간 낸 세금을 정산해 돌려받는 절차입니다.',
    category: '세금',
    emoji: '🧾',
  },
  {
    id: 4,
    question: '주식이나 펀드에 투자해본 경험이 있나요?',
    hint: '증권사 앱을 통해 매수/매도한 경험이 있으신가요?',
    category: '투자',
    emoji: '💹',
  },
  {
    id: 5,
    question: '금리가 오르면 채권 가격이 내려간다는 것을 알고 있나요?',
    hint: '금리와 채권/물가의 관계에 대한 질문입니다.',
    category: '경제',
    emoji: '📊',
  },
];

/* 점수에 따른 레벨 결정 */
export const getLevelByScore = (score) => {
  if (score <= 1) return 'beginner';
  if (score <= 3) return 'elementary';
  return 'intermediate';
};

/* 레벨 정보 */
export const levelInfo = {
  beginner: {
    label: '경제 입문자',
    emoji: '🌱',
    color: '#10B981',
    bgColor: '#D1FAE5',
    description: '경제의 기초부터 차근차근 시작해봐요!\n지금부터 배우면 누구든 전문가가 될 수 있어요.',
    shortDesc: '기초부터 탄탄하게',
  },
  elementary: {
    label: '경제 초급자',
    emoji: '🌿',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    description: '기본 개념은 잡혀 있네요!\n이제 투자와 절세 전략을 배워볼 시간이에요.',
    shortDesc: '투자 기초 다지기',
  },
  intermediate: {
    label: '경제 중급자',
    emoji: '🌳',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: '경제 지식이 상당하네요!\n더 깊이 있는 자산관리와 세금 전략을 알아봐요.',
    shortDesc: '심화 전략 학습',
  },
};
