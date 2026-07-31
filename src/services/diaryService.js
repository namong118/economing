import { supabase } from './supabaseClient';

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
