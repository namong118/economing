/* AI 경제 레벨 진단 질문 (10문항) */
export const diagnosisQuestions = [
  {
    id: 1,
    question: 'ETF(상장지수펀드)가 무엇인지 알고 있나요?',
    hint: '주식처럼 거래할 수 있는 펀드 상품입니다.',
    category: '투자',
  },
  {
    id: 2,
    question: '복리와 단리의 차이를 알고 있나요?',
    hint: '이자에 이자가 붙는 방식의 차이입니다.',
    category: '저축',
  },
  {
    id: 3,
    question: '인플레이션이 무엇인지 알고 있나요?',
    hint: '물가가 지속적으로 오르는 경제 현상입니다.',
    category: '경제',
  },
  {
    id: 4,
    question: '청약통장(주택청약종합저축)에 대해 알고 있나요?',
    hint: '아파트 분양에 응모할 수 있는 통장입니다.',
    category: '부동산',
  },
  {
    id: 5,
    question: '연말정산이 무엇인지 알고 있나요?',
    hint: '1년간 낸 세금을 정산해 돌려받는 절차입니다.',
    category: '세금',
  },
  {
    id: 6,
    question: '환율이 오르면 수출 기업에 어떤 영향이 있는지 알고 있나요?',
    hint: '원화 약세(환율 상승)와 수출 기업 이익의 관계입니다.',
    category: '경제',
  },
  {
    id: 7,
    question: '금리가 오르면 채권 가격이 어떻게 되는지 알고 있나요?',
    hint: '금리와 채권 가격은 반대로 움직입니다.',
    category: '투자',
  },
  {
    id: 8,
    question: 'ISA, IRP 같은 절세 계좌에 대해 알고 있나요?',
    hint: '세금 혜택을 받을 수 있는 금융 계좌입니다.',
    category: '세금',
  },
  {
    id: 9,
    question: '분산투자(포트폴리오)의 개념을 알고 있나요?',
    hint: '여러 자산에 나눠 투자해 리스크를 줄이는 방법입니다.',
    category: '투자',
  },
  {
    id: 10,
    question: '기준금리와 시장금리의 차이를 알고 있나요?',
    hint: '중앙은행이 정하는 금리와 실제 시장에서 형성되는 금리입니다.',
    category: '경제',
  },
];

/* 5단계 답변 선택지 */
export const answerOptions = [
  { score: 1, label: '전혀 모른다' },
  { score: 2, label: '들어본 적 있다' },
  { score: 3, label: '어느 정도 안다' },
  { score: 4, label: '잘 알고 있다' },
  { score: 5, label: '완전히 이해한다' },
];

/* 총점(10~50)에 따른 레벨 결정 */
export const getLevelByScore = (score) => {
  if (score <= 18) return 'beginner';
  if (score <= 27) return 'elementary';
  if (score <= 36) return 'intermediate';
  if (score <= 44) return 'advanced';
  return 'expert';
};

/* 레벨 정보 */
export const levelInfo = {
  beginner: {
    label: '경제 입문자',
    color: 'var(--c-green-500)',
    bgColor: 'var(--c-green-100)',
    description: '경제의 기초부터 차근차근 시작해봐요!\n지금부터 배우면 누구든 전문가가 될 수 있어요.',
    shortDesc: '기초부터 탄탄하게',
  },
  elementary: {
    label: '경제 초급자',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    description: '기본 개념은 잡혀 있네요!\n이제 투자와 절세 전략을 배워볼 시간이에요.',
    shortDesc: '투자 기초 다지기',
  },
  intermediate: {
    label: '경제 중급자',
    color: 'var(--c-yellow-500)',
    bgColor: 'var(--c-yellow-100)',
    description: '경제 지식이 상당하네요!\n더 깊이 있는 자산관리와 세금 전략을 알아봐요.',
    shortDesc: '심화 전략 학습',
  },
  advanced: {
    label: '경제 고급자',
    color: '#F97316',
    bgColor: '#FFF7ED',
    description: '높은 수준의 경제 이해도를 갖고 있네요!\n복잡한 금융 전략과 세금 최적화를 다뤄봐요.',
    shortDesc: '고급 전략 최적화',
  },
  expert: {
    label: '경제 전문가',
    color: '#0B5D49',
    bgColor: 'var(--c-green-50)',
    description: '경제 전반에 깊은 이해를 갖고 있어요!\n전문가 수준의 자산 전략을 함께 탐구해봐요.',
    shortDesc: '전문가급 심화 탐구',
  },
};
