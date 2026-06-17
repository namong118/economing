import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '0 24px',
      height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      transition: 'background 0.25s, border-color 0.25s, backdrop-filter 0.25s',
      maxWidth: '100%',
    }}>
      {/* 로고 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center',
          padding: '4px 0',
        }}
      >
        <span style={{
          fontSize: '18px', fontWeight: '900', letterSpacing: '-0.8px',
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

      {/* CTA 버튼들 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 16px', borderRadius: '10px',
            background: 'none',
            border: scrolled ? '1.5px solid #E2E8F0' : '1.5px solid rgba(33,197,142,0.4)',
            color: scrolled ? '#374151' : '#52C97A',
            cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            letterSpacing: '-0.2px',
            transition: 'all 0.2s',
          }}
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{
            padding: '8px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #52C97A, #16A374)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '-0.2px',
            boxShadow: '0 2px 8px rgba(33,197,142,0.3)',
          }}
        >
          무료 시작
        </button>
      </div>
    </nav>
  );
}
