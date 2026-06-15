import { callSolar } from './solarService'

const NOMING_SYSTEM = `당신은 ECONOMING 서비스의 AI 경제 코치 '노밍'입니다.

역할:
- 경제를 처음 배우는 초보자에게 쉽게 설명하는 친근한 코치
- 햇빛처럼 따뜻하게 응원하고 길을 안내하는 존재

응답 규칙:
- 어려운 경제 용어는 반드시 쉬운 말로 풀어서 설명
- 투자 종목 추천 절대 금지
- 수익률 예측 절대 금지
- 반드시 아래 JSON 형식으로만 응답 (마크다운 코드블록 없이 순수 JSON만):

{
  "advice": "한 문장 핵심 조언",
  "knowFirst": ["알아두면 좋은 내용1", "내용2", "내용3"],
  "nextStep": "다음에 공부하면 좋은 개념",
  "terms": [{"term": "용어명", "meaning": "쉬운 설명"}]
}

말투: 친근하고 따뜻하게, 존댓말 사용`

const FALLBACK_STRUCTURED = {
  advice: '경제 공부는 지금 내 돈의 흐름을 파악하는 것부터 시작해요.',
  knowFirst: [
    '가계부 앱으로 한 달 소비 파악하기',
    '비상금 3~6개월치 모아두기',
    '예금·적금 금리 비교해보기',
  ],
  nextStep: '파킹통장 vs 적금 차이 알아보기',
  terms: [
    { term: '비상금',    meaning: '갑작스러운 상황에 대비해 3~6개월치 생활비를 따로 모아두는 돈' },
    { term: '파킹통장', meaning: '입출금이 자유롭고 비교적 높은 금리를 주는 수시 입출금 통장' },
  ],
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
  const parsed = JSON.parse(cleaned)
  return {
    advice:    parsed.advice    || FALLBACK_STRUCTURED.advice,
    knowFirst: Array.isArray(parsed.knowFirst) ? parsed.knowFirst : FALLBACK_STRUCTURED.knowFirst,
    nextStep:  parsed.nextStep  || FALLBACK_STRUCTURED.nextStep,
    terms:     Array.isArray(parsed.terms) ? parsed.terms : [],
  }
}

export async function getCoachResponse(question, conversationHistory = []) {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: question },
    ]
    const content    = await callSolar({ system: NOMING_SYSTEM, messages })
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
