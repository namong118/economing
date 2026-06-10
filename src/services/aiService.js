/* AI 서비스 — OpenAI 연결 전 mock 응답
 *
 * askCoach() 반환 형식:
 * {
 *   success: true,
 *   structured: {
 *     advice:    string,    // 💡 한 줄 조언
 *     knowFirst: string[],  // 📚 먼저 알아두면 좋은 것
 *     nextStep:  string,    // ➡️ 다음에 공부하면 좋은 것
 *   }
 * }
 * OpenAI 연결 시 이 형식을 유지하며 교체합니다.
 */
import { termExplanations } from '../data/termData';

const coachResponses = [
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

const fallbackResponse = {
  advice: "좋은 질문이에요! AI 연결 후 더 정확한 답변을 드릴 수 있어요.",
  knowFirst: [
    "경제 공부 순서: 소비 파악 → 비상금 → 저축 → 투자",
    "가장 먼저 해야 할 것은 지금 내 돈의 흐름 파악하기",
  ],
  nextStep: "경제 공부를 어떻게 시작할까요? — 노밍에게 물어보세요",
};

export async function askCoach(question) {
  // TODO: OpenAI API 연결 후 이 함수를 교체합니다
  await new Promise(r => setTimeout(r, 900 + Math.random() * 700));

  const q       = question.toLowerCase();
  const matched = coachResponses.find(r => r.keywords.some(k => q.includes(k)));

  return {
    success:    true,
    structured: matched
      ? { advice: matched.advice, knowFirst: matched.knowFirst, nextStep: matched.nextStep }
      : fallbackResponse,
  };
}

// ── 용어 설명 ────────────────────────────────────────────────
export async function explainTerm(term) {
  await new Promise(r => setTimeout(r, 800));

  const normalized = term.trim().toUpperCase();
  const found = Object.values(termExplanations).find(
    t => t.term.toUpperCase() === normalized || t.fullName.includes(term)
  );

  if (found) return { success: true, data: found };

  return {
    success: true,
    data: {
      term,
      fullName: term,
      emoji: '📖',
      explanation: `"${term}"는 아직 데이터베이스에 없는 용어예요. OpenAI 연결 후 정확한 설명을 드릴 수 있어요!`,
      example: '준비 중입니다.',
      point: 'OpenAI API 연결 후 AI가 직접 설명해드릴게요.',
      relatedTerms: [],
    },
  };
}

// ── 다음 학습 추천 ─────────────────────────────────────────
export async function suggestNextTopic(diaryContent, currentLevel) {
  await new Promise(r => setTimeout(r, 600));

  const suggestions = {
    beginner:     ['예금 금리 비교하기', 'ETF 매수 방법', '주식 계좌 개설하기'],
    intermediate: ['해외 ETF 투자', '배당주 찾는 방법', 'IRP 가입하기'],
    advanced:     ['포트폴리오 리밸런싱', '금융소득 종합과세', 'ISA 계좌 활용'],
  };

  const list = suggestions[currentLevel] || suggestions.beginner;
  return list[Math.floor(Math.random() * list.length)];
}
