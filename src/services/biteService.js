import economicBites from '../data/economicBites';
import { callSolar } from './solarService';
import { supabase } from './supabaseClient';

export function getTodaysBite() {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % economicBites.length;
  return economicBites[index];
}

const LEVEL_DIFFICULTY_MAP = {
  beginner:     ['easy'],
  elementary:   ['easy', 'medium'],
  intermediate: ['medium'],
  advanced:     ['medium', 'hard'],
  expert:       ['hard'],
};

const LEVEL_CATEGORY_PRIORITY = {
  beginner:     ['기초', '금리', '저축'],
  elementary:   ['기초', '금리', '저축', '투자'],
  intermediate: ['금리', '투자', '거시경제'],
  advanced:     ['투자', '거시경제', '부동산'],
  expert:       ['거시경제', '투자', '부동산'],
};

export async function getRecommendedBite(userId, userLevel = 'beginner') {
  try {
    const { data: recentBites } = await supabase
      .from('user_bite_history')
      .select('bite_id')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(10);

    const recentIds = recentBites?.map(b => b.bite_id) ?? [];

    const { data: recentConversations } = await supabase
      .from('coach_conversations')
      .select('question')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentQuestions = recentConversations?.map(c => c.question) ?? [];

    const difficulties       = LEVEL_DIFFICULTY_MAP[userLevel]       ?? ['easy'];
    const priorityCategories = LEVEL_CATEGORY_PRIORITY[userLevel]    ?? ['기초'];

    const candidates = economicBites
      .filter(bite => difficulties.includes(bite.difficulty) && !recentIds.includes(bite.id))
      .slice(0, 15);

    if (candidates.length === 0) return getTodaysBite();

    const system = `당신은 ECONOMING의 경제 학습 큐레이터입니다.
사용자 수준과 최근 질문 내역을 참고해서 오늘 가장 적합한 경제 한잎을 추천하세요.

추천 기준:
- 사용자 수준에 맞는 난이도
- 최근 질문과 연관되거나 자연스럽게 이어지는 개념
- 아직 보지 않은 새로운 개념
- 최근 질문이 없으면 수준과 우선 카테고리만 참고

JSON 형식으로만 반환: {"recommended_id": 숫자, "reason": "추천 이유 한 줄"}`;

    const biteList = candidates
      .map(b => `id:${b.id} 제목:${b.title} 카테고리:${b.category} 난이도:${b.difficulty}`)
      .join('\n');

    const content = await callSolar({
      system,
      messages: [{
        role: 'user',
        content: `사용자 수준: ${userLevel}
우선 카테고리: ${priorityCategories.join(', ')}
최근 질문한 내용: ${recentQuestions.length > 0 ? recentQuestions.join(' / ') : '없음'}

후보 목록:
${biteList}`,
      }],
    });

    const clean   = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed  = JSON.parse(clean);
    const recommended = economicBites.find(b => b.id === parsed.recommended_id);
    return recommended ?? getTodaysBite();

  } catch {
    return getTodaysBite();
  }
}

export async function recordBiteView(userId, biteId) {
  if (!userId) return;
  try {
    await supabase
      .from('user_bite_history')
      .upsert(
        { user_id: userId, bite_id: biteId, viewed_at: new Date().toISOString() },
        { onConflict: 'user_id,bite_id' }
      );
  } catch {
    // 기록 실패는 조용히 무시
  }
}
