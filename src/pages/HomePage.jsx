import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 성장 단계 정의 ─────────────────────────────────── */
const STAGES = [
  { key: 'seed',   emoji: '🌱', label: '씨앗 단계',   desc: '경제 기초를 배우는 중이에요.',              short: '씨앗' },
  { key: 'sprout', emoji: '🌿', label: '새싹 단계',   desc: '소비와 저축 습관을 만들고 있어요.',         short: '새싹' },
  { key: 'leaf',   emoji: '🍃', label: '잎 단계',     desc: '투자 기초를 이해하기 시작했어요.',          short: '잎'   },
  { key: 'flower', emoji: '🌸', label: '꽃 단계',     desc: '금융 상품을 직접 다뤄보고 있어요.',        short: '꽃'   },
  { key: 'fruit',  emoji: '🍊', label: '열매 단계',   desc: '자산을 조금씩 불려가고 있어요.',            short: '열매' },
  { key: 'tree',   emoji: '🌳', label: '나무 단계',   desc: '안정적인 경제 루틴을 만들었어요.',         short: '나무' },
  { key: 'forest', emoji: '🌲', label: '숲 단계',     desc: '경제적 자유를 향해 나아가고 있어요.',      short: '숲'   },
];

// 기존 level 값 → 새 stage 키 매핑
const LEVEL_MAP = { beginner: 'seed', elementary: 'sprout', intermediate: 'leaf' };

/* ── 오늘의 미션 더미 데이터 ────────────────────────── */
const MISSIONS = [
  { emoji: '📖', label: '경제 개념 하나 배우기',    path: '/dictionary', done: false },
  { emoji: '🗺️', label: '로드맵 한 단계 진행하기', path: '/roadmap',    done: true  },
  { emoji: '✏️', label: '경제 일기 작성하기',       path: '/diary',      done: false },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const nickname   = profile?.nickname || (user ? '사용자' : '방문자');
  const rawLevel   = profile?.level || 'seed';
  const stageKey   = LEVEL_MAP[rawLevel] ?? rawLevel;
  const stageIndex = STAGES.findIndex(s => s.key === stageKey);
  const stage      = STAGES[stageIndex] ?? STAGES[0];

  return (
    <PageWrapper>
      <div
        className="anim-fade"
        style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '32px 0 64px' }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>

          {/* ══ 1. HERO ══════════════════════════════════════ */}
          <div style={{
            background: 'linear-gradient(135deg, #21C58E 0%, #1AAD7D 60%, #138F68 100%)',
            borderRadius: '24px', padding: '32px 36px',
            marginBottom: '20px', position: 'relative', overflow: 'hidden',
          }}>
            {/* 배경 장식 원 */}
            {[
              { w: 200, h: 200, top: '-60px', right: '80px',  op: 0.08 },
              { w: 120, h: 120, top: '20px',  right: '-20px', op: 0.12 },
              { w: 80,  h: 80,  bottom: '-20px', left: '60%', op: 0.06 },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute', width: c.w, height: c.h, borderRadius: '50%',
                background: `rgba(255,255,255,${c.op})`,
                top: c.top, right: c.right, bottom: c.bottom, left: c.left,
                pointerEvents: 'none',
              }} />
            ))}

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                ✨ AI 경제 성장 코치
              </p>
              <h1 style={{
                fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '900',
                color: '#fff', letterSpacing: '-1.2px', lineHeight: '1.25',
                marginBottom: '12px',
              }}>
                {nickname}님의<br />경제 성장 여정
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px', letterSpacing: '-0.2px' }}>
                작은 배움이 큰 변화를 만듭니다.
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '100px', padding: '8px 18px',
              }}>
                <span style={{ fontSize: '20px' }}>{stage.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{stage.label}</span>
              </div>
            </div>
          </div>

          {/* ══ 2. 성장 단계 진행도 ════════════════════════ */}
          <div style={{
            background: '#fff', borderRadius: '20px',
            border: '1.5px solid #DCF5EB',
            padding: '20px 24px', marginBottom: '20px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              나의 성장 경로
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {STAGES.map((s, i) => {
                const isCurrent = s.key === stageKey;
                const isPast    = i < stageIndex;
                return (
                  <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: '0 0 auto' }}>
                      <div style={{
                        width: isCurrent ? '48px' : '38px',
                        height: isCurrent ? '48px' : '38px',
                        borderRadius: '50%',
                        background: isCurrent ? '#21C58E' : isPast ? '#DCF5EB' : '#F4FAF6',
                        border: isCurrent ? '3px solid #fff' : isPast ? '2px solid #A7F3D0' : '2px solid #E2E8F0',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(33,197,142,0.25)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isCurrent ? '22px' : '18px',
                        transition: 'all 0.2s',
                        cursor: 'default',
                      }}>
                        {s.emoji}
                      </div>
                      <span style={{
                        fontSize: '10px', fontWeight: isCurrent ? '800' : '500',
                        color: isCurrent ? '#21C58E' : '#94A3B8',
                      }}>
                        {s.short}
                      </span>
                    </div>
                    {/* 연결선 */}
                    {i < STAGES.length - 1 && (
                      <div style={{
                        flex: 1, height: '2px', margin: '0 4px',
                        background: isPast ? '#21C58E' : '#E2E8F0',
                        marginBottom: '18px',
                        borderRadius: '2px',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ 3+4. 노밍 + 미션 2컬럼 ════════════════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="home-grid">

            {/* ── 노밍 코칭 카드 ────────────────────────── */}
            <div style={{
              background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
              border: '1.5px solid #FFE08A',
              borderRadius: '20px', padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={`${import.meta.env.BASE_URL}coach.png`}
                  alt="노밍"
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: '#92400E', letterSpacing: '-0.3px' }}>☀️ 노밍</p>
                  <p style={{ fontSize: '11px', color: '#B45309', marginTop: '1px' }}>AI 경제 코치</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#78350F', lineHeight: '1.6', letterSpacing: '-0.4px' }}>
                  좋은 아침이에요! 🌅<br />
                  <span style={{ fontWeight: '500', color: '#92400E' }}>
                    오늘은 어떤 경제 고민이<br />있으신가요?
                  </span>
                </p>
              </div>

              <button
                onClick={() => navigate('/coach')}
                style={{
                  marginTop: 'auto', padding: '12px', borderRadius: '14px',
                  background: '#FFC83D', color: '#78350F',
                  border: 'none', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', letterSpacing: '-0.3px',
                  boxShadow: '0 4px 14px rgba(255,200,61,0.45)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFB800'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFC83D'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                노밍에게 물어보기 →
              </button>
            </div>

            {/* ── 오늘의 성장 미션 ──────────────────────── */}
            <div style={{
              background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: '20px', padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  오늘의 한 걸음
                </p>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: '#21C58E',
                  background: '#F4FAF6', border: '1px solid #DCF5EB',
                  borderRadius: '100px', padding: '3px 10px',
                }}>
                  {MISSIONS.filter(m => m.done).length}/{MISSIONS.length} 완료
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MISSIONS.map(m => (
                  <button
                    key={m.label}
                    onClick={() => navigate(m.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: m.done ? '#F4FAF6' : '#FAFAFA',
                      border: `1.5px solid ${m.done ? '#DCF5EB' : '#F1F5F9'}`,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!m.done) { e.currentTarget.style.borderColor = '#21C58E'; e.currentTarget.style.background = '#F4FAF6'; } }}
                    onMouseLeave={e => { if (!m.done) { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.background = '#FAFAFA'; } }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: m.done ? '#21C58E' : '#fff',
                      border: `2px solid ${m.done ? '#21C58E' : '#CBD5E1'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px',
                    }}>
                      {m.done ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: '14px' }}>{m.emoji}</span>
                    <span style={{
                      fontSize: '13px', fontWeight: '600',
                      color: m.done ? '#64748B' : '#0F172A',
                      textDecoration: m.done ? 'line-through' : 'none',
                      flex: 1,
                    }}>
                      {m.label}
                    </span>
                    {!m.done && <span style={{ fontSize: '14px', color: '#CBD5E1' }}>›</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ 5. 성장 단계 상세 카드 ═════════════════════ */}
          <div style={{
            background: '#fff', border: '1.5px solid #DCF5EB',
            borderRadius: '20px', padding: '24px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              지금 나의 단계
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '20px', flexShrink: 0,
                background: 'linear-gradient(135deg, #F4FAF6, #DCF5EB)',
                border: '2px solid #A7F3D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '36px',
              }}>
                {stage.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.7px', marginBottom: '6px' }}>
                  {stage.label}
                </p>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
                  {stage.desc}
                </p>
              </div>
              <button
                onClick={() => navigate('/diagnosis')}
                style={{
                  flexShrink: 0, padding: '10px 18px', borderRadius: '12px',
                  background: '#F4FAF6', color: '#21C58E',
                  border: '1.5px solid #DCF5EB', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#21C58E'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F4FAF6'; e.currentTarget.style.color = '#21C58E'; }}
              >
                단계 다시 진단 →
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
