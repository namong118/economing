import { supabase } from './supabaseClient';
import { getMockProgress, saveMockProgress } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

export async function initProgress(userId, stepCount = 4) {
  const steps = Array.from({ length: stepCount }, (_, i) => i + 1);

  if (MOCK) {
    const existing = getMockProgress(userId);
    if (existing.length === 0) {
      const rows = steps.map(step => ({ user_id: userId, step, completed: false }));
      saveMockProgress(userId, rows);
    }
    return { error: null };
  }

  const rows = steps.map(step => ({ user_id: userId, step, completed: false }));
  const { error } = await supabase
    .from('roadmap_progress')
    .upsert(rows, { onConflict: 'user_id,step' });
  return { error };
}

