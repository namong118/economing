/* AI가 프롬프트로 지시한 문장 수/줄바꿈을 안정적으로 지키지 않아, 응답을 받은 뒤
   직접 문장 단위로 잘라 개수를 제한하고 줄바꿈으로 이어붙인다 */
export function splitAndCapSentences(text, maxSentences = 3) {
  if (!text) return text
  // AI가 응답 전체를 따옴표로 감싸서 반환하는 경우 대비 — 앞뒤 따옴표 제거
  const cleaned = text.trim().replace(/^["'“‘]+|["'”’]+$/g, '').trim()
  const sentences = (cleaned.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleaned])
    .map(s => s.trim())
    .filter(Boolean)
  return sentences.slice(0, maxSentences).join('\n')
}
