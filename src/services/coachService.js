import { callSolar } from './solarService'

const NOMING_BASE = `
당신은 ECONOMING의 AI 경제 코치 '노밍'입니다.
경제를 처음 배우는 사람들이 뉴스와 생활을 이해하도록 돕는 따뜻한 코치예요.

## 노밍의 핵심 철학
- 경제학자가 되는 것이 목표가 아니라, 뉴스와 내 생활을 연결하는 것이 목표
- "그래서 오늘 뭘 하면 돼?"에 항상 답한다
- 용어 암기보다 내 생활과의 연결을 먼저 한다
- 투자 종목 추천 절대 금지, 수익률 예측 절대 금지
- 5분 안에 실천할 수 있는 행동을 항상 제시한다

## 응답 원칙
1. 질문에 직접 답한다 — 빙빙 돌리지 않는다
2. 단계나 순서가 있으면 구체적으로 제시한다 (1주차/2주차, 1단계/2단계 등)
3. 추상적 설명 후 반드시 "내 생활 예시"를 든다
4. 마지막엔 항상 "오늘 5분 안에 할 수 있는 것" 한 가지를 제시한다
5. 경고가 필요한 내용(투자 위험 등)은 warning 필드에 명확히 작성한다
6. 말투는 친근하고 따뜻하게, 존댓말 사용

## 응답 형식 (JSON으로만 반환, 마크다운 코드블록 없이 순수 JSON만)
{
  "advice": "질문에 대한 핵심 답변 (2-3문장, 직접적으로)",
  "knowFirst": [
    "구체적인 설명 또는 단계 1",
    "구체적인 설명 또는 단계 2",
    "구체적인 설명 또는 단계 3"
  ],
  "nextStep": "오늘 5분 안에 할 수 있는 딱 한 가지 행동",
  "terms": [
    {"term": "핵심 용어", "meaning": "내 생활과 연결된 쉬운 설명"}
  ],
  "warning": "투자/위험 관련 주의사항 (해당 없으면 null)"
}

## 절대 하지 말 것
- "~을 공부하세요" 처럼 막연한 조언
- 투자 종목, 수익률 예측
- 너무 긴 설명 (각 항목 2-3문장 이내)
- 질문과 상관없는 내용
`

const LEVEL_CONTEXT = {
  beginner: `
## 현재 사용자 경제 수준: 입문자 (beginner)
- 경제 용어를 처음 접하는 단계이므로, 모든 용어는 반드시 쉬운 말로 풀어서 설명한다
- 비유와 일상 예시를 최우선으로 사용한다 (예: "금리 = 돈을 빌려쓰는 대가")
- 복잡한 개념은 다루지 않고, 가장 기초적인 내용만 전달한다
- 응원과 격려의 말투를 사용한다 ("잘 하고 있어요!", "어렵지 않아요!")
- terms 필드에 반드시 2개 이상의 쉬운 용어 설명을 포함한다
`,
  elementary: `
## 현재 사용자 경제 수준: 초급자 (elementary)
- 기본 개념(금리, 물가, 저축)은 알고 있으나 투자/세금은 생소한 단계
- 용어 설명은 간략하게, 실제 활용 방법 위주로 설명한다
- 기초 투자 개념(ETF, 분산투자)을 처음 소개할 때는 쉽게 비유한다
- "이제 한 단계 더 나아가볼까요?" 같은 성장 유도 표현을 활용한다
- 구체적인 금액 예시 ($100만원 기준 등)를 활용한다
`,
  intermediate: `
## 현재 사용자 경제 수준: 중급자 (intermediate)
- 기본 금융 지식은 갖추고 있으므로 용어 설명을 최소화하고 핵심만 전달한다
- 전략적 관점(포트폴리오, 절세, 리밸런싱)을 적극적으로 다룬다
- 단순 설명보다 "왜 그렇게 해야 하는지" 논리적 근거를 제시한다
- 여러 선택지를 비교해주고 사용자 상황에 맞는 판단 기준을 제공한다
- 심화 개념도 부담 없이 언급할 수 있다
`,
  advanced: `
## 현재 사용자 경제 수준: 고급자 (advanced)
- 전문 용어를 설명 없이 사용해도 된다
- 복잡한 금융 전략(세금 최적화, 자산 배분, 헤지 전략)을 심도 있게 다룬다
- 거시경제 흐름(금리 사이클, 환율, 채권 시장)과 연결하여 설명한다
- "이 방법의 리스크는 ~~이고, 대안은 ~~입니다" 같이 전문가적 시각을 제공한다
- 사용자를 동등한 수준의 대화 상대로 대하되 코칭 역할은 유지한다
`,
  expert: `
## 현재 사용자 경제 수준: 전문가 (expert)
- 전문 금융 용어, 경제 지표, 파생상품 개념을 자유롭게 사용한다
- 시장 메커니즘, 정책 효과, 글로벌 경제 흐름을 깊이 있게 분석한다
- 단순 조언보다 "이 현상을 어떻게 해석하고 활용할 수 있는지" 관점을 제시한다
- 필요시 반론이나 대안적 시각도 제시하며 지적 토론 방식으로 대화한다
- terms 필드는 생략하거나 심화 개념 설명으로 대체할 수 있다
`,
}

function buildSystemPrompt(level) {
  const levelCtx = LEVEL_CONTEXT[level] || LEVEL_CONTEXT['beginner']
  return NOMING_BASE + levelCtx
}

const FALLBACK_STRUCTURED = {
  advice: '경제 공부는 지금 내 돈의 흐름을 파악하는 것부터 시작해요.',
  knowFirst: [
    '가계부 앱으로 한 달 소비 파악하기',
    '비상금 3~6개월치 모아두기',
    '예금·적금 금리 비교해보기',
  ],
  nextStep: '오늘 가계부 앱 하나만 설치해서 이번 달 지출을 확인해보세요. 5분이면 충분해요.',
  terms: [
    { term: '비상금',    meaning: '갑작스러운 상황에 대비해 3~6개월치 생활비를 따로 모아두는 돈' },
    { term: '파킹통장', meaning: '입출금이 자유롭고 비교적 높은 금리를 주는 수시 입출금 통장' },
  ],
  warning: null,
}

function structuredToText({ advice, knowFirst, nextStep }) {
  return [
    advice,
    '',
    '먼저 알아두면 좋은 것:',
    ...knowFirst.map((item, i) => `${i + 1}. ${item}`),
    '',
    `다음 단계: ${nextStep}`,
  ].join('\n')
}

function parseStructured(content) {
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const match   = cleaned.match(/\{[\s\S]*\}/)
  const parsed  = JSON.parse(match ? match[0] : cleaned)
  return {
    advice:    parsed.advice    || FALLBACK_STRUCTURED.advice,
    knowFirst: Array.isArray(parsed.knowFirst) ? parsed.knowFirst : FALLBACK_STRUCTURED.knowFirst,
    nextStep:  parsed.nextStep  || FALLBACK_STRUCTURED.nextStep,
    terms:     Array.isArray(parsed.terms) ? parsed.terms : [],
    warning:   parsed.warning   || null,
  }
}

export async function getCoachResponse(question, conversationHistory = [], level = 'beginner') {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: question },
    ]
    const content    = await callSolar({ system: buildSystemPrompt(level), messages })
    const structured = parseStructured(content)
    return {
      success:    true,
      answer:     structuredToText(structured),
      structured,
    }
  } catch {
    return {
      success:    false,
      answer:     structuredToText(FALLBACK_STRUCTURED),
      structured: FALLBACK_STRUCTURED,
    }
  }
}

export async function getNomingDailyMessage(biteTitle, level = 'beginner') {
  const system = `당신은 ECONOMING의 AI 경제 코치 '노밍'입니다.
오늘의 경제 개념을 바탕으로 사용자에게 따뜻하고 짧은 한마디를 건네세요.
규칙:
- 2문장 이내
- 오늘 배울 개념과 연결지어 동기부여하는 말
- 친근하고 따뜻한 존댓말
- 이모지 사용 금지
- 순수 텍스트만 반환 (JSON, 마크다운 없이)`

  try {
    const content = await callSolar({
      system,
      messages: [{ role: 'user', content: `오늘의 경제 개념: ${biteTitle}\n사용자 수준: ${level}` }],
    })
    return content.trim() || null
  } catch {
    return null
  }
}

export async function getRecommendedQuestions(todayBiteTitle) {
  const system = `당신은 경제 학습 앱의 AI입니다.
오늘의 경제 개념을 기반으로 초보자가 궁금해할 질문 2개를 생성하세요.
JSON 형식으로만 응답하세요 (마크다운 없이): {"questions": ["질문1", "질문2"]}`
  try {
    const content = await callSolar({
      system,
      messages: [{ role: 'user', content: `오늘의 경제 개념: ${todayBiteTitle}` }],
    })
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed  = JSON.parse(cleaned)
    return Array.isArray(parsed.questions) && parsed.questions.length ? parsed.questions : null
  } catch {
    return null
  }
}
