import { supabase } from './supabaseClient';
import { getMockVocab, addMockVocab, deleteMockVocab } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

function normalize(item) {
  return {
    id:          item.id,
    term:        item.term,
    fullName:    item.full_name  || item.term,
    explanation: item.explanation || '',
    emoji:       item.emoji      || '📖',
    savedAt:     item.created_at?.split('T')[0] ?? '',
  };
}

export async function saveVocabulary(userId, termData) {
  if (MOCK) {
    const { item, alreadySaved } = addMockVocab(userId, {
      term:        termData.term,
      full_name:   termData.fullName,
      explanation: termData.explanation,
      emoji:       termData.emoji || '📖',
    });
    return { data: normalize(item), error: null, alreadySaved };
  }

  const { data: existing } = await supabase
    .from('vocabulary')
    .select('id')
    .eq('user_id', userId)
    .eq('term', termData.term)
    .maybeSingle();
  if (existing) return { data: existing, error: null, alreadySaved: true };

  const { data, error } = await supabase
    .from('vocabulary')
    .insert([{
      user_id:     userId,
      term:        termData.term,
      full_name:   termData.fullName,
      explanation: termData.explanation,
      emoji:       termData.emoji || '📖',
    }])
    .select()
    .single();
  return { data: data ? normalize(data) : null, error };
}

export async function getVocabulary(userId) {
  if (MOCK) {
    return { data: getMockVocab(userId).map(normalize), error: null };
  }

  const { data, error } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data ? data.map(normalize) : [], error };
}

export async function deleteVocabulary(id) {
  if (MOCK) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('mock_vocab_'));
    for (const key of keys) {
      const userId = key.replace('mock_vocab_', '');
      const vocab = getMockVocab(userId);
      if (vocab.find(v => v.id === id)) {
        deleteMockVocab(userId, id);
        break;
      }
    }
    return { error: null };
  }

  const { error } = await supabase.from('vocabulary').delete().eq('id', id);
  return { error };
}

export async function isVocabularySaved(userId, term) {
  if (MOCK) return !!getMockVocab(userId).find(v => v.term === term);

  const { data } = await supabase
    .from('vocabulary')
    .select('id')
    .eq('user_id', userId)
    .eq('term', term)
    .maybeSingle();
  return !!data;
}
