// 개발 전용 localStorage 기반 mock 데이터 스토어
// VITE_MOCK_AUTH=true 일 때만 사용됩니다.

const USERS_KEY   = 'economing_mock_users';
const SESSION_KEY  = 'economing_mock_session';

// ── 세션 ──────────────────────────────────────────────
export function getMockSession()        { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
export function setMockSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
export function clearMockSession()      { localStorage.removeItem(SESSION_KEY); }

// ── 사용자 ────────────────────────────────────────────
export function getMockUsers()      { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
export function saveMockUser(user)  {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── 프로필 ────────────────────────────────────────────
export function getMockProfile(userId) {
  const stored = JSON.parse(localStorage.getItem(`mock_profile_${userId}`) || 'null');
  if (stored) return stored;
  const session = getMockSession();
  return {
    id:               userId,
    nickname:         session?.user?.user_metadata?.nickname || 'User',
    level:            'beginner',
    current_step:     1,
    streak_days:      0,
    last_active_date: null,
    created_at:       new Date().toISOString(),
  };
}
export function updateMockProfile(userId, updates) {
  const profile = getMockProfile(userId);
  const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(`mock_profile_${userId}`, JSON.stringify(updated));
  return updated;
}

// ── 일기 ──────────────────────────────────────────────
export function getMockDiaries(userId) {
  return JSON.parse(localStorage.getItem(`mock_diaries_${userId}`) || '[]');
}
export function addMockDiary(userId, data) {
  const diaries = getMockDiaries(userId);
  const diary = { id: crypto.randomUUID(), user_id: userId, ...data, created_at: new Date().toISOString() };
  diaries.unshift(diary);
  localStorage.setItem(`mock_diaries_${userId}`, JSON.stringify(diaries));
  return diary;
}
export function deleteMockDiary(userId, id) {
  const diaries = getMockDiaries(userId).filter(d => d.id !== id);
  localStorage.setItem(`mock_diaries_${userId}`, JSON.stringify(diaries));
}

// ── 나만의 단어장 ──────────────────────────────────────
export function getMockVocab(userId) {
  return JSON.parse(localStorage.getItem(`mock_vocab_${userId}`) || '[]');
}
export function addMockVocab(userId, data) {
  const vocab = getMockVocab(userId);
  if (vocab.find(v => v.term === data.term)) return { item: vocab.find(v => v.term === data.term), alreadySaved: true };
  const item = { id: crypto.randomUUID(), user_id: userId, ...data, created_at: new Date().toISOString() };
  vocab.unshift(item);
  localStorage.setItem(`mock_vocab_${userId}`, JSON.stringify(vocab));
  return { item, alreadySaved: false };
}
export function deleteMockVocab(userId, id) {
  const vocab = getMockVocab(userId).filter(v => v.id !== id);
  localStorage.setItem(`mock_vocab_${userId}`, JSON.stringify(vocab));
}

// ── 로드맵 ────────────────────────────────────────────
export function getMockProgress(userId) {
  return JSON.parse(localStorage.getItem(`mock_roadmap_${userId}`) || '[]');
}
export function saveMockProgress(userId, rows) {
  localStorage.setItem(`mock_roadmap_${userId}`, JSON.stringify(rows));
}
