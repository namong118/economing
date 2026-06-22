import { callSolar } from './solarService'
import { supabase } from './supabaseClient'

const GOAL_LABELS = {
  home:       '내 집 마련 / 부동산 투자',
  stock:      '주식 / ETF 투자 시작',
  saving:     '목돈 모으기',
  foundation: '재무 기초 다지기',
  retirement: '노후 준비',
  business:   '사업 자금 마련',
}

const LABELS = {
  economic_level: {
    beginner:     '경제 입문자 (GDP·금리도 생소한 수준)',
    elementary:   '경제 초급자 (기본 용어는 알지만 뉴스가 어려운 수준)',
    intermediate: '경제 중급자 (경제 뉴스를 어느 정도 이해하는 수준)',
    advanced:     '경제 고급자 (경제 흐름을 읽고 재무 계획에 반영하는 수준)',
    expert:       '경제 전문가 (경제를 깊이 이해하고 투자 전략까지 세우는 수준)',
  },
  investment_experience: {
    none:  '투자 경험 없음',
    etf:   'ETF 경험 있음',
    stock: '주식 투자 경험 있음',
  },
  occupation: {
    student:    '학생',
    employee:   '직장인',
    freelancer: '프리랜서',
    business:   '사업자',
  },
}

export async function generateRoadmap(answers) {
  const system = `당신은 ECONOMING의 AI 코치 노밍입니다.
사용자의 경제 수준과 관심사를 바탕으로 맞춤 학습 로드맵을 생성합니다.

응답 형식 (JSON만 반환, 다른 텍스트 없이):
{
  "currentStage": "현재 단계 한 줄 설명",
  "goal": "최종 목표 한 줄",
  "steps": [
    {
      "order": 1,
      "title": "단계 제목",
      "description": "이 단계에서 배울 것",
      "topics": ["주제1", "주제2", "주제3"],
      "estimatedDays": 7
    }
  ]
}

steps는 3~5개로 구성. 각 step은 현재 수준에서 목표까지 자연스럽게 이어지도록.
경제 초보자 친화적으로, 투자 종목 추천 절대 금지.

경제 수준 5단계:
- beginner (입문): GDP, 금리도 생소한 수준
- elementary (초급): 기본 용어는 알지만 뉴스가 어려운 수준
- intermediate (중급): 경제 뉴스를 어느 정도 이해하는 수준
- advanced (고급): 경제 흐름을 읽고 재무 계획에 반영하는 수준
- expert (전문): 경제를 깊이 이해하고 투자 전략까지 세우는 수준`

  const userProfile = `경제 수준: ${LABELS.economic_level[answers.economic_level]}
투자 경험: ${LABELS.investment_experience[answers.investment_experience]}
직업: ${LABELS.occupation[answers.occupation]}
관심 분야: ${(answers.interests ?? []).join(', ')}`

  const content = await callSolar({
    system,
    messages: [{ role: 'user', content: userProfile }],
  })

  try {
    const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      currentStage: '경제 기초부터 차근차근 시작해요',
      goal: '경제 뉴스를 읽고 이해할 수 있는 수준',
      steps: [
        { order: 1, title: '경제 기초 다지기', description: '금리, 물가, 환율 등 기본 개념 이해', topics: ['금리', '인플레이션', '환율'], estimatedDays: 7 },
        { order: 2, title: '저축과 투자 이해하기', description: '예금, 적금, ETF 등 기초 금융 상품 이해', topics: ['예금', '적금', 'ETF'], estimatedDays: 7 },
        { order: 3, title: '경제 뉴스 읽기', description: '경제 뉴스를 이해하고 내 생활에 연결하기', topics: ['기준금리', '코스피', '무역수지'], estimatedDays: 14 },
      ],
    }
  }
}

export async function generateNomingIntro(answers) {
  const system = `당신은 ECONOMING의 AI 코치 노밍입니다.
사용자의 프로필을 보고 따뜻하고 친근한 첫 인사를 생성합니다.
2-3문장으로, 사용자의 상황에 공감하고 앞으로 함께할 내용을 간략히 소개하세요.
이모지 1-2개 포함. 투자 추천 금지.`

  const userProfile = `경제 수준: ${LABELS.economic_level[answers.economic_level]}
직업: ${LABELS.occupation[answers.occupation]}
관심 분야: ${(answers.interests ?? []).join(', ')}`

  return await callSolar({
    system,
    messages: [{ role: 'user', content: userProfile }],
  })
}

export function calculateCategoryPriority(interests) {
  const priorityMap = {
    '소비 관리': ['경제 기초', '저축'],
    '저축':      ['저축', '금리'],
    '투자':      ['투자', '금리'],
    '부동산':    ['부동산', '금리'],
    '세금':      ['경제 기초'],
    '경제 뉴스': ['거시경제', '경제 기초'],
  }
  const priority = []
  ;(interests ?? []).forEach(interest => {
    ;(priorityMap[interest] ?? []).forEach(cat => {
      if (!priority.includes(cat)) priority.push(cat)
    })
  })
  const allCategories = ['경제 기초', '금리', '투자', '저축', '부동산', '거시경제']
  allCategories.forEach(cat => { if (!priority.includes(cat)) priority.push(cat) })
  return priority
}

export async function generateIndependenceRoadmap(answers, independenceResult) {
  const system = `당신은 ECONOMING의 AI 경제 코치 노밍입니다.
사용자의 재무 상태와 목표를 바탕으로 경제 자립 로드맵을 생성합니다.

절대 금지:
- 특정 투자 종목 추천
- 수익률 예측
- 특정 금융 상품 가입 권유

가능한 것:
- 재무 기초 습관 제안
- 학습 순서 안내
- 계좌 종류 일반적 설명 (ISA, IRP 등)
- 단계별 목표 설정 가이드

응답 형식 (JSON만 반환):
{
  "currentStatus": "현재 재무 상태 한 줄 요약",
  "goalPath": "목표까지 예상 기간과 방향",
  "steps": [
    {
      "order": 1,
      "title": "단계 제목",
      "description": "이 단계에서 할 것",
      "actions": ["구체적 행동 1", "구체적 행동 2"],
      "estimatedDays": 30,
      "category": "기초 | 저축 | 투자 | 절세 | 부동산 | 연금"
    }
  ],
  "todayAction": "오늘 당장 5분 안에 할 수 있는 행동 1가지",
  "warning": null
}

steps는 4~6개, 현실적이고 실천 가능하게.`

  const userProfile = `나이대: ${answers.age_group ?? '미입력'}
월 소득: ${answers.income_range ?? '미입력'}
재무 목표: ${GOAL_LABELS[answers.financial_goal] ?? '미입력'}
경제 지식 수준: ${answers.economic_level ?? '미입력'}
투자 경험: ${answers.investment_experience ?? '미입력'}
관심 분야: ${(answers.interests ?? []).join(', ') || '미입력'}
재무 자립도 점수: ${independenceResult.score}/50점 (${independenceResult.label})`

  const content = await callSolar({ system, messages: [{ role: 'user', content: userProfile }] })

  try {
    const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      currentStatus: '재무 기초부터 차근차근 시작해요',
      goalPath: '6개월 안에 기반을 만들어봐요',
      steps: [
        {
          order: 1,
          title: '비상금 만들기',
          description: '생활비 3개월치 비상금부터',
          actions: ['월 지출 파악하기', '자동이체 저축 설정'],
          estimatedDays: 90,
          category: '기초',
        },
      ],
      todayAction: '오늘 내 통장 잔액을 확인하고 월 지출을 메모해보세요',
      warning: null,
    }
  }
}

export async function generateTodayAction(userId, financialGoal, independenceLevel, currentStep = null) {
  const { data: prof } = await supabase
    .from('profiles')
    .select('today_action, today_action_date')
    .eq('id', userId)
    .single()

  const today = new Date().toISOString().slice(0, 10)
  if (prof?.today_action_date === today && prof?.today_action) {
    return prof.today_action
  }

  const system = `당신은 ECONOMING의 AI 코치 노밍입니다.
사용자의 재무 목표와 자립 수준에 맞게
오늘 5분 안에 할 수 있는 행동 1가지를 제안합니다.

규칙:
- 투자 종목 추천 금지
- 오늘 바로 실천 가능한 것만
- 1~2문장으로 간결하게
- 따뜻하고 응원하는 말투`

  const stepContext = currentStep
    ? `\n현재 진행 중인 단계: ${currentStep.title} — ${currentStep.description}`
    : ''

  const content = await callSolar({
    system,
    messages: [{ role: 'user', content: `재무 목표: ${GOAL_LABELS[financialGoal] ?? '재무 기초 다지기'}, 자립 단계: ${independenceLevel}${stepContext}` }],
  })

  await supabase
    .from('profiles')
    .update({ today_action: content, today_action_date: today })
    .eq('id', userId)

  return content
}

export async function completeOnboarding(userId, answers) {
  const categoryPriority = calculateCategoryPriority(answers.interests)

  // 1단계: 기본 온보딩 데이터 먼저 저장 (Solar 결과와 무관)
  const { error } = await supabase
    .from('profiles')
    .update({
      onboarding_completed:   true,
      economic_level:         answers.economic_level,
      investment_experience:  answers.investment_experience,
      occupation:             answers.occupation,
      interests:              answers.interests ?? [],
      financial_goal:         answers.financial_goal ?? null,
      age_group:              answers.age_group ?? null,
      income_range:           answers.income_range ?? null,
      bite_category_priority: categoryPriority,
      diagnosis_scores:       answers.diagnosis_scores ?? null,
      diagnosis_total:        answers.diagnosis_total ?? null,
      updated_at:             new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) throw error

  // 2단계: Solar AI 호출 후 결과 추가 저장 (실패해도 온보딩은 완료 상태 유지)
  try {
    const [roadmap, nomingIntro] = await Promise.all([
      generateRoadmap(answers),
      generateNomingIntro(answers),
    ])
    await supabase
      .from('profiles')
      .update({ roadmap, noming_intro: nomingIntro })
      .eq('id', userId)
    return { roadmap, nomingIntro, categoryPriority }
  } catch {
    return { roadmap: null, nomingIntro: null, categoryPriority }
  }
}
