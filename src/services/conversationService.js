/**
 * conversationService.js — 노밍 대화 저장 전담 서비스
 *
 * 테이블: coach_conversations
 *   id         uuid  PK
 *   user_id    uuid  FK → auth.users
 *   question   text
 *   answer     text
 *   created_at timestamptz
 */
import { supabase } from './supabaseClient';

/**
 * 대화 저장
 * - CoachPage에서 질문·응답 직후 호출
 * - 미인증 사용자는 저장 없이 조용히 무시
 */
export async function createConversation({ userId, question, answer }) {
  if (!userId) return { data: null, error: null };

  const { data, error } = await supabase
    .from('coach_conversations')
    .insert({ user_id: userId, question, answer })
    .select()
    .single();

  if (error) console.warn('대화 저장 실패:', error.message);
  return { data, error };
}

/**
 * 사용자 전체 대화 조회 (최신순)
 */
export async function getConversations(userId) {
  if (!userId) return { data: [], error: null };

  const { data, error } = await supabase
    .from('coach_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
}

/**
 * 최근 N개 대화 조회 (홈/코치 화면 활용)
 */
export async function getRecentConversations(userId, limit = 5) {
  if (!userId) return { data: [], error: null };

  const { data, error } = await supabase
    .from('coach_conversations')
    .select('id, question, answer, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: data ?? [], error };
}
