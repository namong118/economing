import economicBites from '../data/economicBites';
import { getCurriculumOrderedBiteIds } from '../data/curriculum';
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

const LS_PREFIX = 'economing_bite_rec__';

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(LS_PREFIX + key)); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); } catch {}
}

/**
 * 커리큘럼 순서(chapter -> order) 기반 추천.
 * user_bite_history에서 이미 본 카드를 걸러내고, 커리큘럼 순서상 아직 안 본
 * 첫 번째 카드를 반환한다. pending(아직 안 만든 31개)은 getCurriculumOrderedBiteIds()가
 * 이미 걸러서 반환하므로 여기서 따로 건너뛸 필요가 없다.
 * 전부 봤으면 복습 모드로 폴백(가장 오래전에 본 것부터) — 이건 임시 처리이고
 * 나중에 제대로 설계할 것.
 * AI(Solar) 호출은 제거했다: 순서가 정해져 있으면 AI가 고를 이유가 없고,
 * 판단 근거로 쓰던 category/difficulty는 내부 일관성이 없는 필드로 밝혀졌다.
 * 기존 AI 추천 로직은 되돌릴 수 있도록 getRecommendedBiteAI로 남겨뒀다.
 */
export async function getRecommendedBite(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `${userId}__${today}`;
  const cached = lsGet(cacheKey);
  if (cached) return cached;

  try {
    const { data: history } = await supabase
      .from('user_bite_history')
      .select('bite_id, viewed_at')
      .eq('user_id', userId);

    const viewedIds = new Set((history ?? []).map(h => h.bite_id));
    const orderedIds = getCurriculumOrderedBiteIds();
    const nextId = orderedIds.find(id => !viewedIds.has(id));

    let result;
    if (nextId != null) {
      result = economicBites.find(b => b.id === nextId) ?? getTodaysBite();
    } else if (history && history.length > 0) {
      const oldest = [...history].sort(
        (a, b) => new Date(a.viewed_at) - new Date(b.viewed_at)
      )[0];
      result = economicBites.find(b => b.id === oldest.bite_id) ?? getTodaysBite();
    } else {
      result = getTodaysBite();
    }

    lsSet(cacheKey, result);
    return result;

  } catch {
    return getTodaysBite();
  }
}

/**
 * [레거시, 미사용] AI(Solar) 기반 추천 — difficulty/category로 후보 15개를 거른 뒤
 * Solar에게 고르게 했던 이전 방식. 커리큘럼 순서 기반으로 교체하면서 되돌릴 수 있도록
 * 남겨둔다. 지우지 말 것.
 */
export async function getRecommendedBiteAI(userId, userLevel = 'beginner') {
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `${userId}__${userLevel}__${today}`;
  const cached = lsGet(cacheKey);
  if (cached) return cached;

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
    const result = recommended ?? getTodaysBite();
    lsSet(cacheKey, result);
    return result;

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
