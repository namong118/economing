import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { supabase } from './supabaseClient';
import { getMockUsers, saveMockUser, getMockSession, setMockSession, clearMockSession } from './mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

// 네이티브 앱(Capacitor)에서 OAuth 로그인 후 돌아올 커스텀 URL 스킴 (카카오 로그인에서 사용)
// Supabase 대시보드 Authentication > URL Configuration > Redirect URLs에도 등록되어 있어야 함
export const NATIVE_OAUTH_REDIRECT = 'com.economing.app://login-callback';

// Google Cloud Console의 "웹 애플리케이션" OAuth 클라이언트 ID (Supabase Google 프로바이더와 동일한 값)
const GOOGLE_WEB_CLIENT_ID = '626919473581-l8qgq3uc7142qjk2hsqfa7tnjjjjq3ou.apps.googleusercontent.com';

let googleNativeInitialized = false;

// 네이티브 앱 시작 시 한 번 호출 (AuthContext에서 호출됨)
export function initNativeGoogleSignIn() {
  if (googleNativeInitialized || !Capacitor.isNativePlatform()) return;
  googleNativeInitialized = true;
  SocialLogin.initialize({ google: { webClientId: GOOGLE_WEB_CLIENT_ID } });
}

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

// 회원 탈퇴: Edge Function이 auth.users를 삭제하면 모든 사용자 데이터가
// ON DELETE CASCADE로 함께 삭제된다. 삭제 성공 후 로컬 세션도 정리한다.
export async function deleteAccount() {
  if (MOCK) {
    clearMockSession();
    return { error: null };
  }

  const { data, error } = await supabase.functions.invoke('delete-account');
  if (error) return { error };
  if (data?.error) return { error: { message: data.error } };

  await supabase.auth.signOut();
  return { error: null };
}

export async function getSession() {
  if (MOCK) {
    return { session: getMockSession(), error: null };
  }

  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// 네이티브 앱: WebView를 직접 이동시키지 않고 인앱 브라우저(Custom Tabs/SFSafariViewController)를 열어
// OAuth를 진행한 뒤, 커스텀 스킴으로 돌아오면 AuthContext의 appUrlOpen 리스너가 세션을 설정함
async function signInWithOAuthProvider(provider, extraOptions = {}) {
  if (Capacitor.isNativePlatform()) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: NATIVE_OAUTH_REDIRECT,
        skipBrowserRedirect: true,
        ...extraOptions,
      },
    });
    if (error || !data?.url) return { data, error };
    await Browser.open({ url: data.url });
    return { data, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + '/economing/',
      ...extraOptions,
    },
  });
  return { data, error };
}

// 네이티브 앱: 브라우저를 전혀 거치지 않는 Google Credential Manager 방식 (삼성 인터넷 등
// Custom Tabs 딥링크 호환성 문제를 원천적으로 피함). 웹에서는 기존 OAuth 리다이렉트 유지.
export async function signInWithGoogle() {
  if (Capacitor.isNativePlatform()) {
    initNativeGoogleSignIn();
    try {
      const login = await SocialLogin.login({
        provider: 'google',
        options: {},
      });
      const idToken = login.result?.idToken;
      if (!idToken) {
        return { data: null, error: { message: 'Google 로그인 토큰을 받지 못했어요.' } };
      }
      const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err?.message || 'Google 로그인에 실패했어요.' } };
    }
  }

  return signInWithOAuthProvider('google');
}

export async function signInWithKakao() {
  return signInWithOAuthProvider('kakao', {
    scopes: 'profile_nickname profile_image',
    queryParams: {
      scope: 'profile_nickname profile_image',
    },
  });
}
