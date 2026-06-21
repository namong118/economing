
export default function ComingSoonSection() {
  return (
    <section style={{
      background: 'linear-gradient(160deg, var(--c-forest-900) 0%, #0D9B6E 100%)',
      padding: 'clamp(60px, 8vw, 100px) 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'rgba(255,200,61,0.08)', pointerEvents: 'none',
      }}/>

      <div style={{
        maxWidth: '680px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', position: 'relative',
      }}>
        {/* 아이콘 */}
        <div style={{ marginBottom: '28px' }}>
          <img src={`${import.meta.env.BASE_URL}appicon.jpg`} alt="ECONOMING" style={{ width: 80, height: 80, borderRadius: 22, objectFit: 'cover', display: 'block' }} />
        </div>

        {/* 타이틀 */}
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: '900', color: '#fff',
          letterSpacing: '-1px', lineHeight: '1.25',
          marginBottom: '16px',
        }}>
          언제 어디서나<br/>경제를 배워보세요
        </h2>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: '1.7', letterSpacing: '-0.3px',
          marginBottom: '44px',
        }}>
          모바일 앱에서도 노밍과 함께<br/>
          경제를 성장시킬 수 있도록 준비하고 있습니다.
        </p>

        {/* 출시 예정 배지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,200,61,0.15)',
          border: '1.5px solid rgba(255,200,61,0.4)',
          color: 'var(--c-yellow-500)',
          borderRadius: '100px', padding: '8px 20px',
          fontSize: '14px', fontWeight: '700',
          letterSpacing: '-0.3px', marginBottom: '36px',
        }}>
          🚧 모바일 앱 출시 예정
        </div>

        {/* 스토어 버튼 */}
        <div style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '44px',
        }}>
          <StoreButton icon="🍎" store="App Store" sub="출시 예정" />
          <StoreButton icon="▶" store="Google Play" sub="출시 예정" />
        </div>

        {/* 구분선 */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '44px' }}/>

        {/* QR 영역 */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          {/* QR 플레이스홀더 */}
          <div style={{
            width: '120px', height: '120px',
            background: 'rgba(255,255,255,0.08)',
            border: '2px dashed rgba(255,255,255,0.25)',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '32px' }}>📱</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>곧 제공 예정</span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.2px' }}>
            웹 버전 바로가기 QR
          </p>
        </div>

        {/* 하단 안내 */}
        <p style={{
          marginTop: '36px',
          fontSize: '13px', color: 'rgba(255,255,255,0.5)',
          letterSpacing: '-0.2px',
        }}>
          현재는 웹 버전으로 이용 가능합니다.
        </p>
      </div>
    </section>
  );
}

function StoreButton({ icon, store, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'rgba(255,255,255,0.08)',
      border: '1.5px solid rgba(255,255,255,0.15)',
      borderRadius: '16px',
      padding: '14px 24px',
      minWidth: '180px',
      cursor: 'not-allowed',
      opacity: 0.7,
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</span>
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>{sub}</p>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px' }}>{store}</p>
      </div>
    </div>
  );
}
