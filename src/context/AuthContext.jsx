import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from '../services/supabaseClient';
import { signIn, signUp, signOut, NATIVE_OAUTH_REDIRECT, initNativeGoogleSignIn } from '../services/authService';
import { upsertProfile } from '../services/profileService';
import { getMockSession } from '../services/mockStore';

// 네이티브 앱에서 인앱 브라우저 OAuth 완료 후 돌아온 콜백 URL(#access_token=...)을 세션으로 변환
async function handleNativeOAuthCallback(url) {
  if (!url.startsWith(NATIVE_OAUTH_REDIRECT)) return;

  const hash = url.split('#')[1] ?? '';
  const params = new URLSearchParams(hash);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) console.error('네이티브 로그인 세션 설정 실패:', error);
  } else {
    console.error('네이티브 로그인 콜백에 토큰 없음:', url);
  }

  await Browser.close().catch(() => {});
}

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const AuthContext = createContext(null);

function extractNickname(user) {
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.nickname ||
    user.user_metadata?.preferred_username ||
    user.email?.split('@')[0] ||
    '사용자'
  );
}

function extractAvatarUrl(user) {
  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.profile_image_url ||
    null
  );
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 언마운트 후 setState 방지
  const mounted = useRef(true);

  const syncProfile = async (currentUser) => {
    if (!currentUser) return;
    try {
      const { data } = await upsertProfile(currentUser.id, {
        nickname:  extractNickname(currentUser),
        avatarUrl: extractAvatarUrl(currentUser),
        email:     currentUser.email || currentUser.user_metadata?.email || null,
        provider:  currentUser.app_metadata?.provider || null,
      });
      if (mounted.current) setProfile(data ?? null);
    } catch (e) {
      console.warn('Profile sync failed:', e.message);
    }
  };

  useEffect(() => {
    mounted.current = true;

    // ── MOCK 모드 ──────────────────────────────────────────
    if (MOCK) {
      const sess = getMockSession();
      const u = sess?.user ?? null;
      setUser(u);
      setSession(sess);
      if (u) {
        syncProfile(u).finally(() => { if (mounted.current) setLoading(false); });
      } else {
        setLoading(false);
      }
      return () => { mounted.current = false; };
    }

    // ── 실제 Supabase 모드 ─────────────────────────────────

    // 1) 앱 최초 로드 시 기존 세션 복원
    //    syncProfile을 await 후에 loading false → profile 깜빡임 방지
    const initialize = async () => {
      try {
        const { data: { session: sess } } = await supabase.auth.getSession();
        if (!mounted.current) return;

        const u = sess?.user ?? null;
        setUser(u);
        setSession(sess);
        if (u) await syncProfile(u);
      } catch (e) {
        console.warn('Auth init error:', e.message);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    initialize();

    // 2) 이후 인증 상태 변경 (로그인, 로그아웃, 토큰 갱신)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sess) => {
        if (!mounted.current) return;

        const u = sess?.user ?? null;
        setUser(u);
        setSession(sess);

        if (event === 'SIGNED_IN' && u) {
          await syncProfile(u);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        // TOKEN_REFRESHED 등은 user/session만 갱신하면 충분
      }
    );

    // 3) 네이티브 앱: 카카오 인앱 브라우저 로그인 완료 후 돌아오는 콜백 처리 + Google 네이티브 로그인 초기화
    let urlOpenListener;
    if (Capacitor.isNativePlatform()) {
      initNativeGoogleSignIn();
      CapacitorApp.addListener('appUrlOpen', ({ url }) => {
        handleNativeOAuthCallback(url);
      }).then(listener => { urlOpenListener = listener; });
    }

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
      urlOpenListener?.remove();
    };
  }, []);

  // ── signIn ──────────────────────────────────────────────
  const handleSignIn = async (email, password) => {
    const result = await signIn(email, password);
    if (MOCK && !result.error && result.data?.user) {
      const u = result.data.user;
      setUser(u);
      setSession({ user: u, access_token: 'mock-token' });
      await syncProfile(u);
    }
    return result;
  };

  // ── signOut ─────────────────────────────────────────────
  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userProfile: profile,   // 하위 호환
        loading,
        signIn:         handleSignIn,
        signUp:         (email, password, nickname) => signUp(email, password, nickname),
        signOut:        handleSignOut,
        refreshProfile: () => syncProfile(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  return context;
}
