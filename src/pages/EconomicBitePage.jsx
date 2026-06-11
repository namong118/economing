import { useParams, useNavigate } from 'react-router-dom';
import economicBites, { getBiteById } from '../data/economicBites';
import { getBiteInfographic } from '../data/biteInfographics';
import PageWrapper from '../components/layout/PageWrapper';

const CATEGORY_COLOR = {
  '금리':     { badge: '#FEF3C7', badgeText: '#92400E' },
  '투자':     { badge: '#D1FAE5', badgeText: '#065F46' },
  '거시경제': { badge: '#DBEAFE', badgeText: '#1E40AF' },
  '저축':     { badge: '#D1FAE5', badgeText: '#14532D' },
  '부동산':   { badge: '#FCE7F3', badgeText: '#831843' },
  '기초':     { badge: '#EDE9FE', badgeText: '#4C1D95' },
};

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '심화' };

function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
        <span style={{ fontSize: '15px' }}>{icon}</span>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#374151', letterSpacing: '-0.3px' }}>
          {title}
        </h3>
      </div>
      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '16px 18px', border: '1.5px solid #E8FAF3',
      }}>
        {children}
      </div>
    </div>
  );
}

export default function EconomicBitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bite = getBiteById(id);

  if (!bite) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#F4FAF6', minHeight: 'calc(100vh - 64px)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>🍃</p>
          <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '20px' }}>찾을 수 없는 경제 한잎이에요.</p>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '12px 24px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #21C58E, #16A374)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700',
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const infographic = getBiteInfographic(bite.title);
  const cat = CATEGORY_COLOR[bite.category] ?? { badge: '#F1F5F9', badgeText: '#374151' };
  const idx = economicBites.findIndex(b => b.id === bite.id);
  const prevBite = idx > 0 ? economicBites[idx - 1] : null;
  const nextBite = idx < economicBites.length - 1 ? economicBites[idx + 1] : null;

  return (
    <PageWrapper>
      <div style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '24px 0 72px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>

          {/* ── 상단 네비 ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '12px',
                padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#374151',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              ← 돌아가기
            </button>
            <button
              onClick={() => navigate('/bites')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700', color: '#21C58E', letterSpacing: '-0.2px',
              }}
            >
              경제 한잎 모음 →
            </button>
          </div>

          {/* ── 메인 카드 (인포그래픽 + 개념명) ── */}
          <div style={{
            background: infographic ? infographic.bg : 'linear-gradient(145deg, #E8FAF3, #D1FAE5)',
            borderRadius: '24px', overflow: 'hidden',
            border: '1.5px solid #A7F3D0',
            marginBottom: '20px',
            boxShadow: '0 6px 24px rgba(33,197,142,0.12)',
          }}>
            {/* 헤더 뱃지 */}
            <div style={{
              padding: '14px 20px 10px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontSize: '14px' }}>🍃</span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669' }}>경제 한잎</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  background: cat.badge, color: cat.badgeText,
                  borderRadius: '100px', padding: '2px 10px',
                }}>
                  {bite.category}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>
                  {DIFFICULTY_LABEL[bite.difficulty]}
                </span>
              </div>
            </div>

            {/* 인포그래픽 */}
            {infographic ? (
              <div style={{ width: '100%' }}>
                <infographic.graphic />
              </div>
            ) : (
              <div style={{
                height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.25)',
              }}>
                <span style={{ fontSize: '64px', opacity: 0.25 }}>🍃</span>
              </div>
            )}

            {/* 개념명 + 한줄 요약 */}
            <div style={{
              padding: '18px 20px 22px',
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(4px)',
            }}>
              <h1 style={{
                fontSize: '26px', fontWeight: '900', color: '#0F172A',
                letterSpacing: '-0.9px', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#21C58E', display: 'inline-block', flexShrink: 0,
                }}/>
                {bite.title}
              </h1>
              <p style={{
                fontSize: '15px', color: '#1E293B',
                lineHeight: '1.7', letterSpacing: '-0.2px', fontWeight: '500',
              }}>
                {bite.summary}
              </p>
            </div>
          </div>

          {/* ── 쉬운 설명 ── */}
          <Section icon="📝" title="쉬운 설명">
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', letterSpacing: '-0.2px' }}>
              {bite.description}
            </p>
          </Section>

          {/* ── 왜 알아야 할까요? ── */}
          <Section icon="💡" title="왜 알아야 할까요?">
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', letterSpacing: '-0.2px' }}>
              {bite.whyImportant}
            </p>
          </Section>

          {/* ── 실생활 예시 ── */}
          <Section icon="🏠" title="실생활 예시">
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                width: '3px', flexShrink: 0,
                background: 'linear-gradient(180deg, #21C58E 0%, #A7F3D0 100%)',
                borderRadius: '100px',
              }}/>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.8', letterSpacing: '-0.2px' }}>
                {bite.realExample}
              </p>
            </div>
          </Section>

          {/* ── 함께 알아두면 좋아요 ── */}
          {bite.relatedTerms && bite.relatedTerms.length > 0 && (
            <Section icon="🔗" title="함께 알아두면 좋아요">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {bite.relatedTerms.map(term => {
                  const related = economicBites.find(b => b.title === term);
                  return (
                    <button
                      key={term}
                      onClick={() => related && navigate(`/bite/${related.id}`)}
                      style={{
                        padding: '8px 14px', borderRadius: '100px',
                        background: related ? '#F0FDF4' : '#F8FAFC',
                        border: `1.5px solid ${related ? '#A7F3D0' : '#E2E8F0'}`,
                        color: related ? '#065F46' : '#94A3B8',
                        fontSize: '13px', fontWeight: '700',
                        cursor: related ? 'pointer' : 'default',
                        letterSpacing: '-0.2px', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        if (related) {
                          e.currentTarget.style.background = '#DCFCE7';
                          e.currentTarget.style.borderColor = '#6EE7B7';
                        }
                      }}
                      onMouseLeave={e => {
                        if (related) {
                          e.currentTarget.style.background = '#F0FDF4';
                          e.currentTarget.style.borderColor = '#A7F3D0';
                        }
                      }}
                    >
                      🍃 {term}
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── 이전 / 다음 한잎 ── */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => prevBite && navigate(`/bite/${prevBite.id}`)}
              disabled={!prevBite}
              style={{
                flex: 1, padding: '14px 16px', borderRadius: '16px',
                background: prevBite ? '#fff' : '#F8FAFC',
                border: `1.5px solid ${prevBite ? '#DCF5EB' : '#E2E8F0'}`,
                cursor: prevBite ? 'pointer' : 'not-allowed',
                textAlign: 'left', opacity: prevBite ? 1 : 0.35,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (prevBite) { e.currentTarget.style.borderColor = '#A7F3D0'; e.currentTarget.style.background = '#FAFFFE'; } }}
              onMouseLeave={e => { if (prevBite) { e.currentTarget.style.borderColor = '#DCF5EB'; e.currentTarget.style.background = '#fff'; } }}
            >
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>← 이전 한잎</div>
              <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.3px' }}>
                {prevBite?.title ?? '—'}
              </div>
            </button>
            <button
              onClick={() => nextBite && navigate(`/bite/${nextBite.id}`)}
              disabled={!nextBite}
              style={{
                flex: 1, padding: '14px 16px', borderRadius: '16px',
                background: nextBite ? '#fff' : '#F8FAFC',
                border: `1.5px solid ${nextBite ? '#DCF5EB' : '#E2E8F0'}`,
                cursor: nextBite ? 'pointer' : 'not-allowed',
                textAlign: 'right', opacity: nextBite ? 1 : 0.35,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (nextBite) { e.currentTarget.style.borderColor = '#A7F3D0'; e.currentTarget.style.background = '#FAFFFE'; } }}
              onMouseLeave={e => { if (nextBite) { e.currentTarget.style.borderColor = '#DCF5EB'; e.currentTarget.style.background = '#fff'; } }}
            >
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>다음 한잎 →</div>
              <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.3px' }}>
                {nextBite?.title ?? '—'}
              </div>
            </button>
          </div>

          {/* ── 경제 한잎 모음 CTA ── */}
          <button
            onClick={() => navigate('/bites')}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              border: '1.5px solid #A7F3D0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              color: '#059669', fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'; }}
          >
            🍃 경제 한잎 모음 전체 보기
          </button>

        </div>
      </div>
    </PageWrapper>
  );
}
