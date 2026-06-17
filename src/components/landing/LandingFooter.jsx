import { useNavigate } from 'react-router-dom';

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: '#0F1F18',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '760px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
      }}>
        {/* 로고 워드마크 */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center',
          }}
        >
          <span style={{
            fontSize: '20px', fontWeight: '900', letterSpacing: '-0.8px',
            display: 'inline-flex', alignItems: 'center', lineHeight: 1,
          }}>
            <span style={{ color: '#52C97A' }}>ECON</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, margin: '0 1px' }}>
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5 C4.5 3.5 1.5 2.5 2 0.5 C3 0 6.5 0.5 7 5Z" fill="#52C97A"/>
                <path d="M7 5 C9.5 3.5 12.5 2.5 12 0.5 C11 0 7.5 0.5 7 5Z" fill="#52C97A"/>
                <circle cx="7" cy="11" r="6.5" fill="#FFC83D"/>
              </svg>
            </span>
            <span style={{ color: '#52C97A' }}>MING</span>
          </span>
        </button>

        {/* 슬로건 */}
        <p style={{
          fontSize: '13px', color: '#4A6455',
          fontWeight: '500', letterSpacing: '-0.2px',
        }}>
          AI 경제 성장 코치
        </p>

        {/* 구분선 */}
        <div style={{ width: '100%', height: '1px', background: '#1E3329' }}/>

        {/* 저작권 */}
        <p style={{
          fontSize: '12px', color: '#2E5441',
          letterSpacing: '-0.2px',
        }}>
          Copyright © 2026 ECONOMING. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
