/**
 * coachService.js — AI 코치 응답 전담 서비스
 *
 * 현재: 키워드 매칭 더미 응답
 * TODO: OpenAI 연결 시 getCoachResponse() 내부만 교체
 *
 * 반환 형식 (변경 금지):
 * {
 *   success:    boolean,
 *   answer:     string,         // DB 저장용 텍스트 전문
 *   structured: {
 *     advice:    string,        // 💡 한 줄 조언
 *     knowFirst: string[],      // 📚 먼저 알아두면 좋은 것
 *     nextStep:  string,        // ➡️ 다음에 공부하면 좋은 것
 *   }
 * }
 */

const MOCK_RESPONSES = [
  {
    keywords: ['시작', '어디서', '어떻게', '처음', '입문', '모르겠', '순서', '공부'],
    advice: "경제 공부는 지금 내 돈의 흐름을 파악하는 것부터 시작하면 돼요.",
    knowFirst: [
      "가계부 앱으로 한 달 소비 파악하기 (뱅크샐러드·토스 추천)",
      "생활비 3~6개월치 비상금 먼저 모으기",
      "예금·적금 금리를 직접 비교해보기",
    ],
    nextStep: "파킹통장 vs 적금 차이 알아보기",
  },
  {
    keywords: ['월급', '급여', '첫 직장', '사회초년생', '취업', '직장인'],
    advice: "월급이 들어오면 저축을 먼저, 남은 돈으로 생활하는 순서가 핵심이에요.",
    knowFirst: [
      "선저축 후소비 원칙 이해하기",
      "청약통장 — 지금 당장 만들어야 하는 이유",
      "파킹통장에 비상금 3개월치 확보하기",
    ],
    nextStep: "50/30/20 법칙으로 월급 쪼개기",
  },
  {
    keywords: ['적금', '예금', '저축', '파킹', '통장', '금리'],
    advice: "비상금은 파킹통장에, 목표 저축은 적금으로 나눠서 관리해보세요.",
    knowFirst: [
      "예금: 목돈을 한번에 맡기고 만기에 이자 수령",
      "적금: 매달 납입, 실질 금리는 예금의 절반 수준",
      "파킹통장: 입출금 자유 + 높은 금리 — 비상금 보관 최적",
    ],
    nextStep: "내게 맞는 저축 목표 금액 설정하기",
  },
  {
    keywords: ['ETF', '주식', '투자', '펀드', '코스피', '나스닥', '증권'],
    advice: "투자는 비상금을 다 모은 뒤, 잃어도 괜찮은 여유 자금으로 시작하세요.",
    knowFirst: [
      "ETF = 수백 개 주식을 한 번에 분산 투자하는 상품",
      "S&P 500 ETF는 미국 대형주 500개에 자동 분산",
      "적립식 투자(매달 소액)가 초보자에게 가장 안전한 방법",
    ],
    nextStep: "증권사 앱에서 비대면 계좌 개설해보기",
  },
  {
    keywords: ['청약', '아파트', '분양', '주택', '부동산'],
    advice: "청약통장은 늦게 만들수록 손해예요. 지금 바로 만드세요.",
    knowFirst: [
      "청약 1순위: 가입 후 최소 1년 이상 경과 필요",
      "월 10만원 납입 시 연 120만원 → 소득공제 대상",
      "세대주 등록 여부가 청약 점수에 영향",
    ],
    nextStep: "청약홈에서 내 청약 가점 계산해보기",
  },
  {
    keywords: ['연말정산', '세금', '환급', 'IRP', '연금', '절세', '공제'],
    advice: "체크카드 사용과 IRP 가입, 이 두 가지만으로도 직장인 절세의 절반은 해결돼요.",
    knowFirst: [
      "체크카드 소득공제율 30% > 신용카드 15%",
      "IRP 연 900만원 납입 시 최대 148만원 환급 가능",
      "연금저축펀드 + IRP 조합이 절세 극대화",
    ],
    nextStep: "IRP 계좌 개설 방법 알아보기",
  },
  {
    keywords: ['얼마', '목표', '재테크', '자산', '돈 모으', '부자'],
    advice: "돈 모으기는 비상금 → 종잣돈 → 투자, 이 세 단계를 순서대로 밟는 게 가장 빨라요.",
    knowFirst: [
      "1단계 비상금: 생활비 3~6개월치, 파킹통장 보관",
      "2단계 종잣돈: 1~2년 목표, 적금으로 강제 저축",
      "3단계 투자: 종잣돈이 생긴 후 ETF 적립식 시작",
    ],
    nextStep: "나만의 월 저축 목표 금액 정하기",
  },
];

const FALLBACK = {
  advice: "좋은 질문이에요! OpenAI 연결 후 더 정확하고 상세한 답변을 드릴게요.",
  knowFirst: [
    "경제 공부 순서: 소비 파악 → 비상금 → 저축 → 투자",
    "가장 먼저 할 것: 지금 내 돈의 흐름 파악하기",
  ],
  nextStep: "경제 공부를 어떻게 시작할까요? — 노밍에게 물어보세요",
};

/** structured 응답 → DB 저장용 텍스트 직렬화 */
function structuredToText({ advice, knowFirst, nextStep }) {
  return [
    advice,
    '',
    '먼저 알아두면 좋은 것:',
    ...knowFirst.map((item, i) => `${i + 1}. ${item}`),
    '',
    `다음 단계: ${nextStep}`,
  ].join('\n');
}

/**
 * 사용자 질문 → 코치 응답 반환
 * OpenAI 연결 시 이 함수만 교체하면 됩니다.
 */
export async function getCoachResponse(question) {
  // TODO: 아래 블록을 OpenAI API 호출로 교체
  // ─────────────────────────────────────────────────────────────
  await new Promise(r => setTimeout(r, 900 + Math.random() * 700));

  const q       = question.toLowerCase();
  const matched = MOCK_RESPONSES.find(r => r.keywords.some(k => q.includes(k)));
  const s       = matched
    ? { advice: matched.advice, knowFirst: matched.knowFirst, nextStep: matched.nextStep }
    : FALLBACK;
  // ─────────────────────────────────────────────────────────────

  return {
    success:    true,
    answer:     structuredToText(s),   // DB 저장용 전문 텍스트
    structured: s,                     // UI 렌더링용 구조화 데이터
  };
}
