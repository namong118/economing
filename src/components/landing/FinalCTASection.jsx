import { useNavigate } from 'react-router-dom';
import NomingIcon from './NomingIcon';

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section style={{
      background: 'linear-gradient(170deg, #F0FAF7 0%, #E8FAF3 50%, #FFF9E6 100%)',
      padding: 'clamp(80px, 10vw, 120px) 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 블롭 */}
      <div style={{
        position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(33,197,142,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        maxWidth: '520px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', position: 'relative',
      }}>
        {/* 아이콘 */}
        <div style={{
          marginBottom: '32px',
          filter: 'drop-shadow(0 8px 24px rgba(33,197,142,0.2))',
        }}>
          <NomingIcon size={100} />
        </div>

        {/* 타이틀 */}
        <h2 style={{
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: '900', color: '#0F1F18',
          letterSpacing: '-1.5px', lineHeight: '1.2',
          marginBottom: '16px',
        }}>
          경제 공부,<br/>
          <span style={{ color: '#21C58E' }}>오늘부터</span> 시작해볼까요?
        </h2>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#4A6455', lineHeight: '1.7',
          letterSpacing: '-0.3px', marginBottom: '48px',
        }}>
          노밍과 함께<br/>경제를 쉽게 시작해보세요.
        </p>

        {/* 소셜 로그인 버튼 */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px' }}>
          {/* 카카오 */}
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '17px 24px', borderRadius: '16px',
              background: '#FEE500', color: '#191919',
              border: 'none', cursor: 'pointer',
              fontSize: '16px', fontWeight: '800',
              letterSpacing: '-0.5px',
              boxShadow: '0 4px 16px rgba(254,229,0,0.5)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(254,229,0,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(254,229,0,0.5)'; }}
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>

          {/* 구글 */}
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '17px 24px', borderRadius: '16px',
              background: '#fff', color: '#374151',
              border: '1.5px solid #E2E8F0', cursor: 'pointer',
              fontSize: '16px', fontWeight: '700',
              letterSpacing: '-0.5px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
          >
            <GoogleIcon />
            구글로 시작하기
          </button>

          {/* 이메일 가입 링크 */}
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', color: '#94A3B8',
              fontWeight: '500', letterSpacing: '-0.2px',
              padding: '8px',
            }}
          >
            이메일로 시작하기 →
          </button>
        </div>
      </div>
    </section>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2C5.582 2 2 4.895 2 8.463c0 2.26 1.493 4.245 3.743 5.374l-.954 3.548c-.083.31.274.556.543.368l4.32-2.879c.115.01.23.015.348.015 4.418 0 8-2.895 8-6.463S14.418 2 10 2Z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35Z" fill="#4285F4"/>
      <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0 0 10 20Z" fill="#34A853"/>
      <path d="M4.405 11.9A6.01 6.01 0 0 1 4.09 10c0-.662.114-1.305.314-1.9V5.51H1.064A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59Z" fill="#FBBC05"/>
      <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0A9.996 9.996 0 0 0 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977Z" fill="#EA4335"/>
    </svg>
  );
}
