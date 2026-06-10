import { supabase } from './supabaseClient';
import { getMockUsers, saveMockUser, getMockSession, setMockSession, clearMockSession } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

export async function signUp(email, password, nickname) {
  if (MOCK) {
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      return { data: null, error: { message: 'already registered' } };
    }
    const user = {
      id:            crypto.randomUUID(),
      email,
      user_metadata: { nickname },
      app_metadata:  {},
      created_at:    new Date().toISOString(),
    };
    saveMockUser({ ...user, _password: password });
    return { data: { user }, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });
  return { data, error };
}

export async function signIn(email, password) {
  if (MOCK) {
    const users = getMockUsers();
    const found = users.find(u => u.email === email && u._password === password);
    if (!found) {
      return { data: null, error: { message: 'Invalid login credentials' } };
    }
    const { _password, ...user } = found;
    const session = { user, access_token: 'mock-token' };
    setMockSession(session);
    return { data: { user, session }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  if (MOCK) {
    clearMockSession();
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  if (MOCK) {
    return { session: getMockSession(), error: null };
  }

  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}
