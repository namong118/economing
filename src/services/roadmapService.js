import { supabase } from './supabaseClient';
import { getMockProgress, saveMockProgress } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

export async function initProgress(userId) {
  if (MOCK) {
    const existing = getMockProgress(userId);
    if (existing.length === 0) {
      const rows = [1, 2, 3, 4].map(step => ({ user_id: userId, step, completed: false }));
      saveMockProgress(userId, rows);
    }
    return { error: null };
  }

  const rows = [1, 2, 3, 4].map(step => ({ user_id: userId, step, completed: false }));
  const { error } = await supabase
    .from('roadmap_progress')
    .upsert(rows, { onConflict: 'user_id,step' });
  return { error };
}

export async function completeStep(userId, step) {
  if (MOCK) {
    const rows = getMockProgress(userId).map(r =>
      r.step === step
        ? { ...r, completed: true, completed_at: new Date().toISOString() }
        : r
    );
    saveMockProgress(userId, rows);
    return { error: null };
  }

  const { error } = await supabase
    .from('roadmap_progress')
    .upsert(
      { user_id: userId, step, completed: true, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,step' }
    );
  return { error };
}

export async function getProgress(userId) {
  if (MOCK) {
    return { data: getMockProgress(userId), error: null };
  }

  const { data, error } = await supabase
    .from('roadmap_progress')
    .select('*')
    .eq('user_id', userId)
    .order('step');
  return { data: data || [], error };
}
