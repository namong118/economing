import { useNavigate } from 'react-router-dom';
import NomingIcon from './NomingIcon';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg, #E8FAF3 0%, #F0FAF7 50%, #FFF9E6 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 블롭 */}
      <div style={{
        position: 'absolute', top: '10%', right: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(33,197,142,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-80px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,200,61,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* 상단 배지 */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: '#D1FAE5', color: '#059669',
        borderRadius: '100px', padding: '6px 16px',
        fontSize: '13px', fontWeight: '700',
        letterSpacing: '-0.2px', marginBottom: '36px',
      }}>
        <span>✨</span> AI 경제 성장 코치
      </div>

      {/* 앱 아이콘 */}
      <div style={{
        marginBottom: '36px',
        filter: 'drop-shadow(0 12px 32px rgba(33,197,142,0.25))',
        animation: 'heroFloat 3s ease-in-out infinite',
      }}>
        <NomingIcon size={140} />
      </div>

      {/* 메인 카피 */}
      <h1 style={{
        fontSize: 'clamp(28px, 6vw, 48px)',
        fontWeight: '900',
        color: '#0F1F18',
        lineHeight: '1.25',
        letterSpacing: '-1.5px',
        textAlign: 'center',
        marginBottom: '16px',
        maxWidth: '520px',
      }}>
        경제 공부,<br/>
        <span style={{ color: '#52C97A' }}>어디서부터 시작해야</span><br/>
        할지 모르겠다면
      </h1>

      {/* 서브 카피 */}
      <p style={{
        fontSize: 'clamp(15px, 2.5vw, 18px)',
        color: '#4A6455',
        lineHeight: '1.7',
        textAlign: 'center',
        marginBottom: '48px',
        maxWidth: '360px',
        letterSpacing: '-0.3px',
      }}>
        노밍이 가장 쉬운 순서부터<br/>
        알려드릴게요.
      </p>

      {/* CTA 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '340px' }}>
        <button
          onClick={() => navigate('/signup')}
          style={{
            padding: '18px 32px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #52C97A, #16A374)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '17px', fontWeight: '800',
            letterSpacing: '-0.5px',
            boxShadow: '0 8px 24px rgba(33,197,142,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(33,197,142,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(33,197,142,0.35)'; }}
        >
          무료로 시작하기
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '16px 32px', borderRadius: '18px',
            background: 'rgba(255,255,255,0.8)', color: '#374151',
            border: '1.5px solid #D1FAE5', cursor: 'pointer',
            fontSize: '15px', fontWeight: '600',
            letterSpacing: '-0.3px',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.8)'}
        >
          이미 계정이 있어요
        </button>
      </div>

      {/* 스크롤 힌트 */}
      <div style={{
        position: 'absolute', bottom: '28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        color: '#A0C0B4', fontSize: '12px', fontWeight: '500',
        animation: 'heroFloat 2s ease-in-out infinite',
      }}>
        <span>아래로 내려보세요</span>
        <span style={{ fontSize: '18px' }}>↓</span>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
