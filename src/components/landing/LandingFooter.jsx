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
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="ECONOMING"
            style={{ height: '36px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
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
