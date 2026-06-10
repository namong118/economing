/**
 * 회원가입 페이지
 *
 * 닉네임 + 이메일 + 비밀번호로 계정을 만듭니다.
 * 회원가입 성공 시 Supabase가 이메일 인증 메일을 발송합니다.
 * (Supabase 대시보드에서 이메일 인증 설정을 끌 수도 있습니다)
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithKakao } from '../services/authService';

const MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [nickname,     setNickname]     = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  const handleKakao = async () => {
    setKakaoLoading(true);
    const { error: kakaoError } = await signInWithKakao();
    if (kakaoError) {
      setError('카카오 로그인 중 오류가 발생했어요.');
      setKakaoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 클라이언트 유효성 검사
    if (!nickname.trim()) { setError('닉네임을 입력해주세요.'); return; }
    if (!email)           { setError('이메일을 입력해주세요.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요.'); return; }
    if (password !== confirm) { setError('비밀번호가 일치하지 않아요.'); return; }

    setLoading(true);
    const { error: authError } = await signUp(email, password, nickname.trim());
    setLoading(false);

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        setError('이미 사용 중인 이메일이에요.');
      } else if (authError.message.includes('Password should be')) {
        setError('비밀번호는 6자 이상이어야 해요.');
      } else {
        setError('회원가입 중 오류가 발생했어요. 다시 시도해주세요.');
      }
      return;
    }

    // 성공 상태 표시
    setSuccess(true);
  };

  // 회원가입 성공 화면
  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #ECFDF5, #EEF2FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '12px', letterSpacing: '-0.8px' }}>
            회원가입 완료!
          </h2>
          {MOCK ? (
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.7', marginBottom: '28px' }}>
              계정이 만들어졌어요. 바로 로그인할 수 있어요!<br />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>🧪 개발 모드 — 이메일 인증 없음</span>
            </p>
          ) : (
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.7', marginBottom: '28px' }}>
              가입하신 이메일로 인증 메일을 보냈어요.
              <br />메일함을 확인하고 인증을 완료해주세요.
            </p>
          )}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 32px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#fff', border: 'none', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
            }}
          >
            로그인하러 가기 →
          </button>
          <p style={{ marginTop: '12px', fontSize: '13px', color: '#94A3B8' }}>
            (이메일 인증 없이 바로 로그인하려면 Supabase 대시보드 &gt; Auth &gt; Confirm email 을 비활성화하세요)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #ECFDF5 0%, #F0FDF4 50%, #EEF2FF 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📈</div>
          <h1
            style={{
              fontSize: '28px', fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px', margin: 0,
            }}
          >
            ECONOMING
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
            계정을 만들고 경제 공부를 시작하세요!
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div
          style={{
            background: '#FFFFFF', borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #E2E8F0',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.6px', marginBottom: '24px' }}>
            회원가입
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 닉네임 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                닉네임
              </label>
              <input
                type="text" placeholder="경제왕" value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                이메일
              </label>
              <input
                type="email" placeholder="name@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                비밀번호 <span style={{ color: '#94A3B8', fontWeight: '400' }}>(6자 이상)</span>
              </label>
              <input
                type="password" placeholder="비밀번호" value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                비밀번호 확인
              </label>
              <input
                type="password" placeholder="비밀번호를 다시 입력" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password"
                style={{
                  ...inputStyle,
                  borderColor: confirm && confirm !== password ? '#EF4444' : '#E2E8F0',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e)  => e.target.style.borderColor = confirm !== password ? '#EF4444' : '#E2E8F0'}
              />
              {confirm && confirm !== password && (
                <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>비밀번호가 일치하지 않아요.</p>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#DC2626', fontWeight: '500' }}>
                ⚠️ {error}
              </div>
            )}

            {/* 가입 버튼 */}
            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px', borderRadius: '12px',
                background: loading ? '#A7F3D0' : 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', border: 'none', fontSize: '15px',
                fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px', letterSpacing: '-0.3px',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
              }}
            >
              {loading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          {/* 구분선 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>또는 간편 가입</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* 카카오 버튼 */}
          <button
            type="button"
            onClick={handleKakao}
            disabled={kakaoLoading || loading}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '10px',
              width:          '100%',
              padding:        '13px',
              borderRadius:   '12px',
              background:     kakaoLoading ? '#e4d24a' : '#FEE500',
              color:          '#3A1D1D',
              border:         'none',
              fontSize:       '15px',
              fontWeight:     '700',
              cursor:         kakaoLoading ? 'not-allowed' : 'pointer',
              letterSpacing:  '-0.3px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.748 1.647 5.17 4.134 6.627L5.1 21l5.07-2.674C10.704 18.44 11.345 18.5 12 18.5c5.523 0 10-3.477 10-7.7C22 6.477 17.523 3 12 3z" fill="#3A1D1D"/>
            </svg>
            {kakaoLoading ? '카카오 연결 중...' : '카카오로 시작하기'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '4px', fontSize: '14px', color: '#64748B' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#10B981', fontWeight: '700', textDecoration: 'none' }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  border: '1.5px solid #E2E8F0', fontSize: '15px',
  color: '#0F172A', background: '#F8FAFC',
  transition: 'border-color 0.15s', boxSizing: 'border-box',
};
