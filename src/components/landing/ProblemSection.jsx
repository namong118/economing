const PROBLEMS = [
  '경제 뉴스가 너무 어렵다',
  '무엇부터 공부해야 할지 모르겠다',
  'ETF가 뭔지 모르겠다',
  '투자 공부가 막막하다',
  '경제 공부가 오래 가지 않는다',
  '경제 용어들이 너무 낯설다',
];

export default function ProblemSection() {
  return (
    <section style={{
      background: '#fff',
      padding: 'clamp(60px, 8vw, 100px) 24px',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* 섹션 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{
            display: 'inline-block',
            background: '#FEF9EC', color: '#B45309',
            borderRadius: '100px', padding: '5px 14px',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '-0.2px', marginBottom: '16px',
          }}>
            많은 분들의 고민
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '900', color: '#0F1F18',
            letterSpacing: '-1px', lineHeight: '1.25',
          }}>
            이런 고민 해본 적 있나요?
          </h2>
        </div>

        {/* 문제 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px',
          marginBottom: '52px',
        }}>
          {PROBLEMS.map((text, i) => (
            <ProblemCard key={i} text={text} />
          ))}
        </div>

        {/* 하단 해소 문구 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #E8FAF3, #D1FAE5)',
            borderRadius: '20px', padding: '20px 32px',
          }}>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              fontWeight: '800', color: '#065F46',
              letterSpacing: '-0.5px', margin: 0,
              display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
            }}>
              그래서
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="ECONOMING"
                style={{ height: 'clamp(28px, 3.5vw, 36px)', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}
              />
              이 만들어졌습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: '#F8FAFC',
      borderRadius: '16px',
      padding: '20px 22px',
      border: '1.5px solid #E2E8F0',
    }}>
      <span style={{
        fontSize: '15px', fontWeight: '600',
        color: '#374151', letterSpacing: '-0.3px',
        lineHeight: '1.45',
      }}>
        {text}
      </span>
    </div>
  );
}
