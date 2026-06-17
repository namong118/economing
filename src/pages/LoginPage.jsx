import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithKakao, signInWithGoogle } from '../services/authService';

/* ── Google G 아이콘 ─────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M47.53 24.56c0-1.68-.15-3.3-.43-4.86H24v9.19h13.22c-.57 3.07-2.3 5.67-4.9 7.42v6.16h7.93c4.64-4.27 7.28-10.57 7.28-17.91z"/>
      <path fill="#34A853" d="M24 48c6.64 0 12.21-2.2 16.28-5.96l-7.93-6.16c-2.2 1.48-5.02 2.35-8.35 2.35-6.42 0-11.85-4.33-13.79-10.16H2v6.36C6.05 42.97 14.41 48 24 48z"/>
      <path fill="#FBBC05" d="M10.21 28.07A14.93 14.93 0 0 1 9.69 24c0-1.41.24-2.78.52-4.07V13.57H2A23.97 23.97 0 0 0 0 24c0 3.87.93 7.53 2 10.43l8.21-6.36z"/>
      <path fill="#EA4335" d="M24 9.54c3.61 0 6.85 1.24 9.4 3.67l7.05-7.05C36.2 2.2 30.63 0 24 0 14.41 0 6.05 5.03 2 13.57l8.21 6.36C12.15 13.87 17.58 9.54 24 9.54z"/>
    </svg>
  );
}

/* ── 카카오 아이콘 ────────────────────────────────────────── */
function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.748 1.647 5.17 4.134 6.627L5.1 21l5.07-2.674C10.704 18.44 11.345 18.5 12 18.5c5.523 0 10-3.477 10-7.7C22 6.477 17.523 3 12 3z" fill="#3A1D1D"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const BASE_URL = import.meta.env.BASE_URL;

  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [kakaoLoading,  setKakaoLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmail,     setShowEmail]     = useState(false);

  if (user) navigate('/home', { replace: true });

  const anyLoading = loading || kakaoLoading || googleLoading;

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error: e } = await signInWithGoogle();
    if (e) { setError('Google 로그인 중 오류가 발생했어요.'); setGoogleLoading(false); }
  };

  const handleKakao = async () => {
    setKakaoLoading(true);
    const { error: e } = await signInWithKakao();
    if (e) { setError('카카오 로그인 중 오류가 발생했어요.'); setKakaoLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);
    if (authError) {
      if (authError.message.includes('Invalid login credentials')) setError('이메일 또는 비밀번호가 올바르지 않아요.');
      else if (authError.message.includes('Email not confirmed'))  setError('이메일 인증이 필요해요. 메일함을 확인해주세요.');
      else setError('로그인 중 오류가 발생했어요. 다시 시도해주세요.');
      return;
    }
    navigate('/home', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F0FDF4 0%, #F2FBF5 60%, #FFF9EB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* ── 브랜드 헤더 ────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src={`${BASE_URL}icon.jpg`}
            alt="ECONOMING"
            style={{
              width: '68px', height: '68px', borderRadius: '20px',
              objectFit: 'cover', margin: '0 auto 14px', display: 'block',
              boxShadow: '0 6px 20px rgba(33,197,142,0.25)',
            }}
          />
          {/* ECON🟡MING 로고 */}
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 8px', lineHeight: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#2A7A4B' }}>
              ECON
              <svg width="20" height="32" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5 C4.5 3.5 1.5 2.5 2 0.5 C3 0 6.5 0.5 7 5Z" fill="#52C97A" />
                <path d="M7 5 C9.5 3.5 12.5 2.5 12 0.5 C11 0 7.5 0.5 7 5Z" fill="#52C97A" />
                <circle cx="7" cy="11" r="6.5" fill="#FFC83D" />
              </svg>
              MING
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: '500' }}>
            경제 초보자를 위한 AI 성장 코치
          </p>
        </div>

        {/* ── 메인 카드 ────────────────────────────────── */}
        <div style={{
          background: '#fff', borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1px solid #E8F5EF',
        }}>

          {/* 헤드라인 + 가치 제안 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '21px', fontWeight: '900', color: '#0F172A',
              letterSpacing: '-0.7px', lineHeight: '1.35', margin: '0 0 16px',
            }}>
              경제 성장 여정을<br />지금 시작해요
            </h2>
            <div style={{
              background: '#F2FBF5', borderRadius: '14px',
              padding: '14px 16px', border: '1px solid #DCF5EB',
            }}>
              <p style={{
                fontSize: '12px', fontWeight: '700', color: '#52C97A',
                marginBottom: '10px', letterSpacing: '0.2px',
              }}>
                ☀️ 노밍과 함께
              </p>
              {[
                '경제 공부 순서 찾기',
                '나에게 맞는 성장 단계',
                '쉬운 경제 코칭',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px' }}>
                  <div style={{
                    width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                    background: '#52C97A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: '#fff', fontWeight: '800',
                  }}>✓</div>
                  <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '10px', padding: '10px 14px',
              fontSize: '13px', color: '#DC2626', fontWeight: '500',
              marginBottom: '16px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── 소셜 로그인 CTA ─────────────────────────── */}
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={anyLoading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%', padding: '14px',
              borderRadius: '14px', background: '#fff', color: '#3C4043',
              border: '1.5px solid #DADCE0', fontSize: '15px', fontWeight: '700',
              cursor: anyLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.3px', marginBottom: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              opacity: googleLoading ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!anyLoading) { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'; }}
          >
            <GoogleIcon />
            {googleLoading ? 'Google 연결 중...' : 'Google로 시작하기'}
          </button>

          {/* 카카오 */}
          <button
            type="button"
            onClick={handleKakao}
            disabled={anyLoading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', width: '100%', padding: '14px',
              borderRadius: '14px',
              background: kakaoLoading ? '#e4d24a' : '#FEE500',
              color: '#3A1D1D', border: 'none',
              fontSize: '15px', fontWeight: '700',
              cursor: anyLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.3px', marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(254,229,0,0.45)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!anyLoading) { e.currentTarget.style.background = '#f5dc00'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(254,229,0,0.55)'; } }}
            onMouseLeave={e => { if (!kakaoLoading) { e.currentTarget.style.background = '#FEE500'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(254,229,0,0.45)'; } }}
          >
            <KakaoIcon />
            {kakaoLoading ? '카카오 연결 중...' : '카카오로 시작하기'}
          </button>

          {/* ── 이메일 로그인 (토글) ─────────────────────── */}
          <button
            onClick={() => setShowEmail(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 0 12px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {showEmail ? '이메일 로그인 닫기 ↑' : '이메일로 로그인 ↓'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </button>

          {showEmail && (
            <form
              onSubmit={handleSubmit}
              className="anim-fade"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}
            >
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px',
                  border: '1.5px solid #E2E8F0', fontSize: '14px',
                  color: '#0F172A', background: '#F8FAFC',
                  boxSizing: 'border-box', transition: 'border-color 0.15s', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#52C97A'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px',
                  border: '1.5px solid #E2E8F0', fontSize: '14px',
                  color: '#0F172A', background: '#F8FAFC',
                  boxSizing: 'border-box', transition: 'border-color 0.15s', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#52C97A'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px', borderRadius: '12px',
                  background: loading ? '#A7F3D0' : 'linear-gradient(135deg, #52C97A, #1AAD7D)',
                  color: '#fff', border: 'none', fontSize: '14px', fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(33,197,142,0.3)',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? '로그인 중...' : '이메일 로그인'}
              </button>
            </form>
          )}

          {/* 회원가입 */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', margin: 0 }}>
            계정이 없으신가요?{' '}
            <Link to="/signup" style={{ color: '#52C97A', fontWeight: '700', textDecoration: 'none' }}>
              회원가입
            </Link>
          </p>
        </div>

        {/* 둘러보기 */}
        <p style={{ textAlign: 'center', marginTop: '18px' }}>
          <Link to="/home" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>
            ← 로그인 없이 둘러보기
          </Link>
        </p>
      </div>
    </div>
  );
}
