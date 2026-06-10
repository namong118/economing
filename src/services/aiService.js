/**
 * aiService.js — 용어 설명·학습 추천 등 공통 AI 유틸리티
 *
 * AI 코치 대화 응답: coachService.js → getCoachResponse()
 * AI 코치 대화 저장: conversationService.js → createConversation()
 */
import { termExplanations } from '../data/termData';

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
