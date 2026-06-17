export default function ValueSection() {
  return (
    <section style={{
      background: 'linear-gradient(160deg, #0D9B6E 0%, #52C97A 60%, #3ECFA0 100%)',
      padding: 'clamp(60px, 8vw, 100px) 24px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 배경 원형 장식 */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-40px',
        width: '240px', height: '240px', borderRadius: '50%',
        background: 'rgba(255,200,61,0.12)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        maxWidth: '760px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', position: 'relative',
      }}>
        {/* 아이콘 */}
        <div style={{ marginBottom: '32px' }}>
          <img src={`${import.meta.env.BASE_URL}appicon.jpg`} alt="ECONOMING" style={{ width: 100, height: 100, borderRadius: 28, objectFit: 'cover', display: 'block' }} />
        </div>

        {/* 반박 문장 */}
        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: '600',
          letterSpacing: '-0.3px',
          textDecoration: 'line-through',
          marginBottom: '12px',
        }}>
          경제 용어 사전이 아닙니다.&nbsp;&nbsp;투자 추천 서비스도 아닙니다.
        </p>

        {/* 핵심 정의 */}
        <h2 style={{
          fontSize: 'clamp(26px, 5vw, 44px)',
          fontWeight: '900',
          color: '#fff',
          lineHeight: '1.2',
          letterSpacing: '-1.5px',
          marginBottom: '28px',
        }}>
          경제 초보자를 위한<br/>
          <span style={{
            display: 'inline-block',
            background: '#FFC83D',
            color: '#0F1F18',
            borderRadius: '12px',
            padding: '2px 16px',
            marginTop: '6px',
          }}>
            AI 경제 성장 코치
          </span>
          &nbsp;서비스입니다.
        </h2>

        {/* 설명 텍스트 */}
        <p style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: '1.8',
          letterSpacing: '-0.3px',
          maxWidth: '480px',
        }}>
          ECONOMING은 단순히 경제 용어를 설명하는 서비스가 아닙니다.<br/>
          사용자의 현재 경제 수준을 이해하고<br/>
          무엇을 먼저 공부해야 하는지 알려주는<br/>
          AI 경제 성장 코치입니다.
        </p>
      </div>
    </section>
  );
}
