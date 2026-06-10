import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { signIn, signUp, signOut } from '../services/authService';
import { upsertProfile } from '../services/profileService';
import { getMockSession } from '../services/mockStore';

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

  const syncProfile = async (currentUser) => {
    if (!currentUser) return;
    try {
      const { data } = await upsertProfile(currentUser.id, {
        nickname:  extractNickname(currentUser),
        avatarUrl: extractAvatarUrl(currentUser),
        email:     currentUser.email || currentUser.user_metadata?.email || null,
        provider:  currentUser.app_metadata?.provider || null,
      });
      setProfile(data);
    } catch (e) {
      console.warn('Profile sync failed:', e.message);
    }
  };

  useEffect(() => {
    if (MOCK) {
      const sess = getMockSession();
      const u = sess?.user ?? null;
      setUser(u);
      setSession(sess);
      if (u) syncProfile(u);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      const u = sess?.user ?? null;
      setUser(u);
      setSession(sess);
      if (u) {
        console.log('Supabase user:', u);
        console.log('user_metadata:', u.user_metadata);
        console.log('app_metadata:', u.app_metadata);
        syncProfile(u);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sess) => {
        const u = sess?.user ?? null;
        setUser(u);
        setSession(sess);
        if (event === 'SIGNED_IN' && u) {
          console.log('Supabase user:', u);
          console.log('user_metadata:', u.user_metadata);
          console.log('app_metadata:', u.app_metadata);
          await syncProfile(u);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email, password) => {
    const result = await signIn(email, password);
    if (MOCK && !result.error && result.data?.user) {
      setUser(result.data.user);
      setSession({ user: result.data.user, access_token: 'mock-token' });
      await syncProfile(result.data.user);
    }
    return result;
  };

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
