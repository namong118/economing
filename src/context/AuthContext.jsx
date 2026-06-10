import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { signIn, signUp, signOut } from '../services/authService';
import { getProfile } from '../services/profileService';
import { getMockSession } from '../services/mockStore';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (MOCK) {
      const session     = getMockSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadProfile(currentUser.id);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) loadProfile(currentUser.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (event === 'SIGNED_IN' && currentUser) {
          await loadProfile(currentUser.id);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await getProfile(userId);
    setUserProfile(data);
  };

  const handleSignIn = async (email, password) => {
    const result = await signIn(email, password);
    if (MOCK && !result.error && result.data?.user) {
      setUser(result.data.user);
      await loadProfile(result.data.user.id);
    }
    return result;
  };

  const handleSignUp = async (email, password, nickname) => {
    return await signUp(email, password, nickname);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (MOCK) {
      setUser(null);
      setUserProfile(null);
    }
    return result;
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn:         handleSignIn,
        signUp:         handleSignUp,
        signOut:        handleSignOut,
        refreshProfile,
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
