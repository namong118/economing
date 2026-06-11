import { supabase } from './supabaseClient';
import { getMockDiaries, addMockDiary, deleteMockDiary } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

function normalize(item) {
  return {
    id:           item.id,
    date:         item.created_at?.split('T')[0] ?? '',
    title:        item.title,
    content:      item.content,
    mood:         item.mood || '😊',
    learnedTerms: item.learned_terms || [],
    aiSuggestion: item.ai_suggestion || '',
  };
}

export async function saveDiary(userId, diaryData) {
  if (MOCK) {
    const diary = addMockDiary(userId, {
      title:         diaryData.title,
      content:       diaryData.content,
      mood:          diaryData.mood || '😊',
      learned_terms: diaryData.learnedTerms || [],
      ai_suggestion: '',
    });
    return { data: normalize(diary), error: null };
  }

  const { data, error } = await supabase
    .from('diaries')
    .insert([{
      user_id:       userId,
      title:         diaryData.title,
      content:       diaryData.content,
      mood:          diaryData.mood || '😊',
      learned_terms: diaryData.learnedTerms || [],
    }])
    .select()
    .single();
  return { data: data ? normalize(data) : null, error };
}

export async function getDiaries(userId) {
  if (MOCK) {
    return { data: getMockDiaries(userId).map(normalize), error: null };
  }

  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data ? data.map(normalize) : [], error };
}

export async function deleteDiary(id) {
  if (MOCK) {
    // mock에서는 user_id를 모르므로 모든 사용자의 일기에서 찾아 삭제
    const keys = Object.keys(localStorage).filter(k => k.startsWith('mock_diaries_'));
    for (const key of keys) {
      const userId = key.replace('mock_diaries_', '');
      const diaries = getMockDiaries(userId);
      if (diaries.find(d => d.id === id)) {
        deleteMockDiary(userId, id);
        break;
      }
    }
    return { error: null };
  }

  const { error } = await supabase.from('diaries').delete().eq('id', id);
  return { error };
}

export async function getDiaryCount(userId) {
  if (MOCK) return getMockDiaries(userId).length;

  const { count, error } = await supabase
    .from('diaries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return error ? 0 : count;
}

// ── economic_journals CRUD ────────────────────────────────────

export async function getJournals(userId) {
  const { data, error } = await supabase
    .from('economic_journals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('getJournals:', error); return []; }
  return data || [];
}

export async function createJournal(userId, fields) {
  const { data, error } = await supabase
    .from('economic_journals')
    .insert({ user_id: userId, ...fields })
    .select()
    .single();
  if (error) { console.error('createJournal:', error); return { success: false }; }
  return { success: true, journal: data };
}

export async function updateJournal(id, fields) {
  const { data, error } = await supabase
    .from('economic_journals')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateJournal:', error); return { success: false }; }
  return { success: true, journal: data };
}

export async function deleteJournal(id) {
  const { error } = await supabase.from('economic_journals').delete().eq('id', id);
  if (error) { console.error('deleteJournal:', error); return { success: false }; }
  return { success: true };
}
