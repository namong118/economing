/* 경제 성장 5단계 로드맵 — 모든 사용자 공통 */

export const roadmap = [
  {
    step: 1,
    title: '돈의 흐름 이해하기',
    description: '월급을 받으면 어떻게 관리해야 할까요? 돈이 들어오고 나가는 흐름을 파악하는 것이 경제 공부의 첫 걸음입니다.',
    topics: ['월급 관리법', '소비 vs 저축 비율', '가계부 시작하기', '비상금 만들기'],
    duration: '1~2주',
    emoji: '💰',
    color: '#10B981',
    coachQuestions: [
      '월급 받으면 가장 먼저 해야 할 것은?',
      '저축과 소비 비율은 어떻게 정해야 할까요?',
      '비상금은 얼마나 모아야 할까요?',
    ],
  },
  {
    step: 2,
    title: '금리 이해하기',
    description: '예금과 적금의 차이, 금리가 내 돈에 어떤 영향을 주는지 이해합니다. 금리를 알면 돈을 더 효율적으로 굴릴 수 있어요.',
    topics: ['금리란?', '예금 vs 적금', '복리의 마법', '금리 비교하는 법'],
    duration: '1주',
    emoji: '🏦',
    color: '#6366F1',
    coachQuestions: [
      '적금과 예금 중 뭐가 더 유리한가요?',
      '금리가 오르면 내 저축에 어떤 영향이 생기나요?',
      '파킹통장이 뭔가요?',
    ],
  },
  {
    step: 3,
    title: '투자 기초',
    description: '주식과 ETF란 무엇인지, 왜 저축만으로는 부족한지, 투자를 어떻게 시작해야 하는지 알아봅니다.',
    topics: ['주식이란?', 'ETF란?', '분산투자 원칙', '첫 투자 시작하기'],
    duration: '2주',
    emoji: '📈',
    color: '#F59E0B',
    coachQuestions: [
      '주식 투자를 꼭 해야 할까요?',
      'ETF가 주식보다 안전한가요?',
      '투자는 얼마부터 시작하면 될까요?',
    ],
  },
  {
    step: 4,
    title: '세금과 연금',
    description: '연말정산으로 세금을 돌려받고, IRP와 연금저축으로 노후를 준비하면서 세금도 줄이는 방법을 배웁니다.',
    topics: ['연말정산 완벽 이해', 'IRP 세액공제', '연금저축펀드', '직장인 절세 전략'],
    duration: '1~2주',
    emoji: '🧾',
    color: '#EC4899',
    coachQuestions: [
      '연말정산을 어떻게 더 많이 돌려받나요?',
      'IRP는 무조건 가입해야 하나요?',
      '직장인이 세금을 줄이는 방법이 있나요?',
    ],
  },
  {
    step: 5,
    title: '부동산과 청약',
    description: '청약통장을 언제 만들어야 하는지, 전세와 월세의 차이, 내 집 마련을 위한 첫 단계를 알아봅니다.',
    topics: ['청약통장 활용법', '아파트 청약 방법', '전세 vs 월세 비교', '부동산 세금 기초'],
    duration: '2주',
    emoji: '🏠',
    color: '#8B5CF6',
    coachQuestions: [
      '청약통장은 언제부터 만들어야 하나요?',
      '전세와 월세 중 어떤 게 유리한가요?',
      '청약은 어떻게 하는 건가요?',
    ],
  },
];

// 진단 레벨 → 권장 시작 스텝
export const levelStartStep = {
  beginner:     1,
  elementary:   2,
  intermediate: 3,
};

// 기존 코드 호환성 유지 (HomePage 등에서 roadmaps[level] 형태로 쓰던 곳)
export const roadmaps = {
  beginner:     roadmap,
  elementary:   roadmap,
  intermediate: roadmap,
};
