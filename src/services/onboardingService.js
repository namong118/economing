import { callSolar } from './solarService'
import { supabase } from './supabaseClient'

const LABELS = {
  economic_level: {
    beginner:     '경제 입문자',
    intermediate: '경제 기초 학습자',
    advanced:     '경제 중급자',
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
경제 초보자 친화적으로, 투자 종목 추천 절대 금지.`

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
      bite_category_priority: categoryPriority,
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
