import { callSolar } from './solarService'

export async function explainTerm(term) {
  const system = `당신은 경제 용어를 쉽게 설명하는 전문가입니다.
초등학생도 이해할 수 있도록 설명하세요.
100자 이내로 간결하게 답변하세요.`
  try {
    const content = await callSolar({
      system,
      messages: [{ role: 'user', content: `"${term}"을 쉽게 설명해줘` }],
    })
    return { success: true, data: { term, explanation: content } }
  } catch {
    return {
      success: false,
      data: { term, explanation: `"${term}"에 대한 설명을 가져올 수 없어요.` },
    }
  }
}

export async function suggestNextTopic(diaryContent, currentLevel) {
  const suggestions = {
    beginner:     ['예금 금리 비교하기', 'ETF 매수 방법', '주식 계좌 개설하기'],
    intermediate: ['해외 ETF 투자', '배당주 찾는 방법', 'IRP 가입하기'],
    advanced:     ['포트폴리오 리밸런싱', '금융소득 종합과세', 'ISA 계좌 활용'],
  }
  const list = suggestions[currentLevel] || suggestions.beginner
  return list[Math.floor(Math.random() * list.length)]
}
