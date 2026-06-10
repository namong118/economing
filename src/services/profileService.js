import { supabase } from './supabaseClient';
import { getMockProfile, updateMockProfile } from './mockStore';


const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

export async function getProfile(userId) {
  if (MOCK) return { data: getMockProfile(userId), error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateLevel(userId, level) {
  if (MOCK) return { data: updateMockProfile(userId, { level }), error: null };

  const { data, error } = await supabase
    .from('profiles')
    .update({ level, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export async function updateCurrentStep(userId, step) {
  if (MOCK) return { data: updateMockProfile(userId, { current_step: step }), error: null };

  const { data, error } = await supabase
    .from('profiles')
    .update({ current_step: step, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export async function upsertProfile(userId, { nickname, avatarUrl, email, provider }) {
  if (MOCK) {
    const existing = getMockProfile(userId);
    const updates = {};
    if (!existing?.nickname   && nickname)   updates.nickname   = nickname;
    if (!existing?.avatar_url && avatarUrl)  updates.avatar_url = avatarUrl;
    if (!existing?.email      && email)      updates.email      = email;
    if (!existing?.provider   && provider)   updates.provider   = provider;
    return { data: updateMockProfile(userId, updates), error: null };
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (!existing) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, nickname, avatar_url: avatarUrl, email, provider })
      .select()
      .single();
    return { data, error };
  }

  const updates = { updated_at: new Date().toISOString() };
  if (!existing.nickname   && nickname)   updates.nickname   = nickname;
  if (!existing.avatar_url && avatarUrl)  updates.avatar_url = avatarUrl;
  if (!existing.email      && email)      updates.email      = email;
  if (!existing.provider   && provider)   updates.provider   = provider;

  if (Object.keys(updates).length === 1) return { data: existing, error: null };

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data: data ?? existing, error };
}

export async function updateStreak(userId) {
  if (MOCK) {
    const today     = new Date().toISOString().split('T')[0];
    const profile   = getMockProfile(userId);
    const lastDate  = profile.last_active_date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === today) return { data: profile, error: null };
    const newStreak = lastDate === yesterdayStr ? (profile.streak_days || 0) + 1 : 1;
    return { data: updateMockProfile(userId, { streak_days: newStreak, last_active_date: today }), error: null };
  }

  const today   = new Date().toISOString().split('T')[0];
  const { data: profile } = await getProfile(userId);
  if (!profile) return { error: { message: 'Profile not found' } };

  const lastDate  = profile.last_active_date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  if (lastDate === today) return { data: profile, error: null };
  if (lastDate === yesterdayStr) newStreak = (profile.streak_days || 0) + 1;

  const { data, error } = await supabase
    .from('profiles')
    .update({ streak_days: newStreak, last_active_date: today, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}
