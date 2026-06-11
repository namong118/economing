import { supabase } from './supabaseClient';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

// ── Mock (localStorage) ──────────────────────────────────
function dictKey(userId) { return `mock_userdict_${userId}`; }
function getMockDict(userId) {
  return JSON.parse(localStorage.getItem(dictKey(userId)) || '[]');
}
function setMockDict(userId, items) {
  localStorage.setItem(dictKey(userId), JSON.stringify(items));
}

// ── Normalizer ───────────────────────────────────────────
function normalize(item) {
  return {
    id:         item.id,
    term:       item.term,
    meaning:    item.meaning     || '',
    sourceType: item.source_type || '',
    sourceId:   item.source_id   || '',
    savedAt:    item.created_at?.split('T')[0] ?? '',
  };
}

// ── Save ─────────────────────────────────────────────────
export async function saveTerm({ userId, term, meaning = '', sourceType = '', sourceId = '' }) {
  if (MOCK) {
    const items = getMockDict(userId);
    if (items.find(i => i.term === term)) return { data: null, error: null, alreadySaved: true };
    const item = {
      id: crypto.randomUUID(), user_id: userId,
      term, meaning, source_type: sourceType, source_id: sourceId,
      created_at: new Date().toISOString(),
    };
    setMockDict(userId, [item, ...items]);
    return { data: normalize(item), error: null, alreadySaved: false };
  }

  const { data: existing } = await supabase
    .from('user_dictionary').select('id')
    .eq('user_id', userId).eq('term', term).maybeSingle();
  if (existing) return { data: normalize(existing), error: null, alreadySaved: true };

  const { data, error } = await supabase
    .from('user_dictionary')
    .insert([{ user_id: userId, term, meaning, source_type: sourceType, source_id: sourceId }])
    .select().single();
  return { data: data ? normalize(data) : null, error, alreadySaved: false };
}

// ── Fetch all ────────────────────────────────────────────
export async function getTerms(userId) {
  if (MOCK) return { data: getMockDict(userId).map(normalize), error: null };
  const { data, error } = await supabase
    .from('user_dictionary').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false });
  return { data: data ? data.map(normalize) : [], error };
}

// ── Delete ───────────────────────────────────────────────
export async function deleteTerm(id) {
  if (MOCK) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('mock_userdict_'));
    for (const key of keys) {
      const uid   = key.replace('mock_userdict_', '');
      const items = getMockDict(uid);
      if (items.find(i => i.id === id)) { setMockDict(uid, items.filter(i => i.id !== id)); break; }
    }
    return { error: null };
  }
  const { error } = await supabase.from('user_dictionary').delete().eq('id', id);
  return { error };
}
