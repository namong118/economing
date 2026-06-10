/* 랜딩 페이지 - 서비스 첫 화면 */
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-no-nav anim-fade"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #ECFDF5 0%, #F0FDF4 40%, #EEF2FF 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
      }}
    >
      {/* 상단 로고 영역 */}
      <div style={{ paddingTop: '60px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#D1FAE5',
            color: '#059669',
            borderRadius: '100px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '32px',
            letterSpacing: '-0.2px',
          }}
        >
          <span>🌱</span> AI 경제 학습 서비스
        </div>

        {/* 메인 로고 */}
        <div style={{ marginBottom: '12px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px',
              lineHeight: '1',
              margin: 0,
            }}
          >
            ECONOMING
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#9CA3AF',
              marginTop: '8px',
              letterSpacing: '2px',
              fontWeight: '500',
            }}
          >
            Economy + ing
          </p>
        </div>
      </div>

      {/* 중앙 일러스트 영역 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '100px',
              lineHeight: 1,
              marginBottom: '32px',
              filter: 'drop-shadow(0 8px 24px rgba(16,185,129,0.2))',
            }}
          >
            📈
          </div>

          <h2
            style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#111827',
              lineHeight: '1.35',
              letterSpacing: '-1px',
              marginBottom: '16px',
            }}
          >
            경제, 어디서부터
            <br />
            시작해야 할지 모르겠다면?
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#6B7280',
              lineHeight: '1.7',
              letterSpacing: '-0.3px',
            }}
          >
            AI가 나의 수준을 진단하고
            <br />
            딱 맞는 학습 로드맵을 만들어드려요
          </p>
        </div>
      </div>

      {/* 특징 카드들 */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '32px',
        }}
      >
        {[
          { emoji: '🎯', text: 'AI 레벨 진단' },
          { emoji: '🗺️', text: '맞춤 로드맵' },
          { emoji: '📚', text: '쉬운 용어 설명' },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '14px',
              padding: '14px 8px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.9)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.emoji}</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#374151', letterSpacing: '-0.3px' }}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* CTA 버튼 영역 */}
      <div style={{ paddingBottom: '48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button
          size="lg"
          onClick={() => navigate('/diagnosis')}
          style={{ borderRadius: '18px', fontSize: '17px', padding: '18px 24px' }}
        >
          🚀 내 경제 레벨 알아보기
        </Button>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '8px',
            letterSpacing: '-0.3px',
          }}
        >
          둘러보기만 할게요 →
        </button>
      </div>
    </div>
  );
}
