/**
 * 로그인 페이지
 *
 * 이메일 + 비밀번호로 로그인합니다.
 * 로그인 성공 시 이전 페이지 또는 /home으로 이동합니다.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithKakao } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  const handleKakao = async () => {
    setKakaoLoading(true);
    const { error: kakaoError } = await signInWithKakao();
    if (kakaoError) {
      setError('카카오 로그인 중 오류가 발생했어요.');
      setKakaoLoading(false);
    }
    // 성공 시 카카오 페이지로 리디렉트되므로 별도 처리 불필요
  };

  // 이미 로그인된 경우 홈으로 바로 이동
  if (user) navigate('/home', { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 form submit 동작(페이지 새로고침) 막기
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      // Supabase 에러 메시지를 한국어로 변환
      if (authError.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않아요.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('이메일 인증이 필요해요. 메일함을 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했어요. 다시 시도해주세요.');
      }
      return;
    }

    // 로그인 성공 → 홈으로 이동
    navigate('/home', { replace: true });
  };

  return (
    <div
      style={{
        minHeight:      '100vh',
        background:     'linear-gradient(160deg, #ECFDF5 0%, #F0FDF4 50%, #EEF2FF 100%)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📈</div>
          <h1
            style={{
              fontSize:         '28px',
              fontWeight:       '900',
              background:       'linear-gradient(135deg, #10B981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing:    '-1px',
              margin:           0,
            }}
          >
            ECONOMING
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
            AI 경제 성장 코치에 오신 걸 환영해요!
          </p>
        </div>

        {/* 로그인 카드 */}
        <div
          style={{
            background:   '#FFFFFF',
            borderRadius: '20px',
            padding:      '36px 32px',
            boxShadow:    '0 8px 32px rgba(0,0,0,0.08)',
            border:       '1px solid #E2E8F0',
          }}
        >
          <h2
            style={{
              fontSize:      '20px',
              fontWeight:    '800',
              color:         '#0F172A',
              letterSpacing: '-0.6px',
              marginBottom:  '24px',
            }}
          >
            로그인
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 이메일 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                이메일
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                style={{
                  width:        '100%',
                  padding:      '12px 14px',
                  borderRadius: '10px',
                  border:       '1.5px solid #E2E8F0',
                  fontSize:     '15px',
                  color:        '#0F172A',
                  background:   '#F8FAFC',
                  transition:   'border-color 0.15s',
                  boxSizing:    'border-box',
                }}
                onFocus={(e)  => e.target.style.borderColor = '#10B981'}
                onBlur={(e)   => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{
                  width:        '100%',
                  padding:      '12px 14px',
                  borderRadius: '10px',
                  border:       '1.5px solid #E2E8F0',
                  fontSize:     '15px',
                  color:        '#0F172A',
                  background:   '#F8FAFC',
                  transition:   'border-color 0.15s',
                  boxSizing:    'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div
                style={{
                  background:   '#FEF2F2',
                  border:       '1px solid #FECACA',
                  borderRadius: '10px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  color:        '#DC2626',
                  fontWeight:   '500',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding:      '14px',
                borderRadius: '12px',
                background:   loading ? '#A7F3D0' : 'linear-gradient(135deg, #10B981, #059669)',
                color:        '#fff',
                border:       'none',
                fontSize:     '15px',
                fontWeight:   '700',
                cursor:       loading ? 'not-allowed' : 'pointer',
                marginTop:    '4px',
                letterSpacing: '-0.3px',
                boxShadow:    loading ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
                transition:   'all 0.15s',
              }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* 카카오 로그인 버튼 */}
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
            {kakaoLoading ? '카카오 연결 중...' : '카카오로 로그인'}
          </button>

          {/* 회원가입 링크 */}
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#64748B' }}>
            계정이 없으신가요?{' '}
            <Link to="/signup" style={{ color: '#10B981', fontWeight: '700', textDecoration: 'none' }}>
              회원가입
            </Link>
          </p>
        </div>

        {/* 홈으로 돌아가기 */}
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/home" style={{ fontSize: '13px', color: '#94A3B8' }}>
            ← 로그인 없이 둘러보기
          </Link>
        </p>
      </div>
    </div>
  );
}
