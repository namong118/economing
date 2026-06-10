/* 더미 사용자 데이터 */

/* 나만의 경제 사전 - 저장된 용어들 */
export const dummyDictionary = [
  {
    id: 1,
    term: 'ETF',
    fullName: '상장지수펀드',
    explanation: '여러 주식을 한 바구니에 담아 주식처럼 거래하는 펀드',
    savedAt: '2025-06-01',
    emoji: '📊',
  },
  {
    id: 2,
    term: '금리',
    fullName: '이자율',
    explanation: '돈을 빌리거나 맡길 때 적용되는 이자의 비율',
    savedAt: '2025-06-03',
    emoji: '📉',
  },
  {
    id: 3,
    term: '인플레이션',
    fullName: '물가상승',
    explanation: '물가가 전반적으로 지속적으로 오르는 현상',
    savedAt: '2025-06-05',
    emoji: '🎈',
  },
  {
    id: 4,
    term: '배당',
    fullName: '배당금',
    explanation: '기업이 이익을 주주에게 나눠주는 것',
    savedAt: '2025-06-07',
    emoji: '💵',
  },
  {
    id: 5,
    term: 'IRP',
    fullName: '개인형 퇴직연금',
    explanation: '노후 대비 연금으로 세액공제 혜택이 있음',
    savedAt: '2025-06-08',
    emoji: '🏖️',
  },
];

/* 경제 일기 - 작성된 일기들 */
export const dummyDiaries = [
  {
    id: 1,
    date: '2025-06-08',
    title: 'ETF를 처음 이해했다',
    content: '오늘 ETF가 뭔지 드디어 이해했다. 여러 주식을 한 번에 살 수 있다는 게 너무 편리한 것 같다. KODEX 200이 코스피 200개 기업에 투자하는 거라고 하니 분산투자 효과도 있고.',
    mood: '😊',
    learnedTerms: ['ETF', '분산투자', '코스피'],
    aiSuggestion: '다음엔 ETF의 종류(국내/해외)와 수수료 차이를 공부해보세요!',
  },
  {
    id: 2,
    date: '2025-06-06',
    title: '금리와 물가의 관계',
    content: '금리가 오르면 대출이자가 오르니까 소비가 줄고, 그래서 물가가 내려간다는 걸 배웠다. 한국은행이 왜 금리를 올리는지 이제 이해가 된다.',
    mood: '🤔',
    learnedTerms: ['기준금리', '인플레이션', '한국은행'],
    aiSuggestion: '연준(Fed)과 한국은행의 금리 정책 차이도 공부해보세요!',
  },
  {
    id: 3,
    date: '2025-06-04',
    title: '예금 금리 비교해봤다',
    content: '은행마다 예금 금리가 다르다는 걸 처음 알았다. 시중은행보다 인터넷은행이 금리가 높고, 저축은행은 더 높지만 리스크도 있다고 한다.',
    mood: '😮',
    learnedTerms: ['예금', '금리', '저축은행'],
    aiSuggestion: '예금자보호법과 5,000만원 한도에 대해서도 알아두세요!',
  },
];

/* 더미 사용자 상태 */
export const dummyUserState = {
  nickname: '경제 초보자',
  level: 'beginner',
  currentStep: 1,
  completedSteps: [],
  savedTermsCount: 5,
  diaryCount: 3,
  streakDays: 3,
};
