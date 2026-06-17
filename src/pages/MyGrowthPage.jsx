import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LEVELS, getNextLevelInfo } from '../data/levelData';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 정적 매핑 ────────────────────────────────────────────── */
const ECONOMIC_LEVEL = {
  beginner:     { label: '초급자', emoji: '🌱', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE',
                  desc: '경제 공부를 이제 막 시작하시는 분' },
  intermediate: { label: '중급자', emoji: '📚', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
                  desc: '기본 개념은 알고 더 깊이 배우고 싶은 분' },
  advanced:     { label: '고급자', emoji: '🔍', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A',
                  desc: '꾸준히 공부 중이며 심화 내용에 관심 있는 분' },
};

const INVESTMENT_EXP = {
  none:  { label: '투자 경험 없음',       emoji: '🤔' },
  etf:   { label: 'ETF 투자 경험 있음',   emoji: '📈' },
  stock: { label: '주식 투자 경험 있음',  emoji: '💹' },
};

const OCCUPATION = {
  student:    { label: '학생',     emoji: '🎓' },
  employee:   { label: '직장인',   emoji: '💼' },
  freelancer: { label: '프리랜서', emoji: '💻' },
  business:   { label: '사업자',   emoji: '🏢' },
};

/* ── 규칙 기반 노밍 한 줄 분석 ────────────────────────────── */
function generateAnalysis(profile) {
  const level    = profile?.economic_level;
  const exp      = profile?.investment_experience;
  const interests = profile?.interests ?? [];
  const hasInterest = (k) => interests.includes(k);

  if (!level) return "온보딩을 완료하면 노밍의 맞춤 분석을 받을 수 있어요!";

  if (level === 'beginner') {
    if (hasInterest('투자') && hasInterest('저축'))
      return "저축과 투자 둘 다 관심이 있으시네요. 투자 전에 비상금을 먼저 마련하는 게 핵심이에요. 순서대로 함께 나아가봐요!";
    if (hasInterest('투자') || hasInterest('ETF 기초'))
      return "투자에 관심이 있으시군요. 먼저 비상금 3개월치를 파킹통장에 모아두고, 그다음 ETF 기초부터 시작해봐요.";
    if (hasInterest('저축'))
      return "저축부터 시작하는 건 최고의 선택이에요! 파킹통장과 적금 차이를 먼저 알아보면 바로 실천할 수 있어요.";
    if (hasInterest('소비 관리'))
      return "소비 관리에 관심이 있으시네요. 가계부 앱으로 한 달 지출을 파악하는 것부터 시작해봐요. 작은 변화가 큰 차이를 만들어요.";
    if (hasInterest('세금'))
      return "세금 공부, 정말 좋은 출발이에요! 연말정산 기초와 체크카드 공제율부터 알아두면 바로 도움이 돼요.";
    return "경제 공부, 이제 막 시작하셨군요. 지금 내 돈의 흐름을 파악하는 것부터 시작해보세요. 노밍이 순서대로 안내해드릴게요.";
  }

  if (level === 'intermediate') {
    if (exp === 'etf')
      return "ETF 경험이 있으시네요! 적립식 투자를 꾸준히 이어가면서 IRP·연금저축 절세 전략도 함께 챙겨보세요.";
    if (exp === 'stock')
      return "주식 투자 경험도 있으시네요. 개별 종목 리스크를 줄이기 위해 ETF 비중을 늘려가는 전략을 고려해봐요.";
    if (hasInterest('부동산'))
      return "중급자 단계에서 부동산에 관심이 있으시군요. 청약통장 관리와 부동산 기초 개념을 먼저 정리해봐요.";
    if (hasInterest('세금'))
      return "세금을 챙기려는 마인드가 훌륭해요. IRP와 연금저축 조합으로 매년 세금을 절약해봐요.";
    return "어느 정도 기초가 잡혀 있으시네요! ETF 심화나 절세 전략 등 한 단계 깊은 내용에 도전해봐요.";
  }

  if (level === 'advanced') {
    if (hasInterest('세금'))
      return "경험이 풍부하시네요! IRP·연금저축 절세 극대화와 금융소득 종합과세 대비를 점검해보면 좋을 것 같아요.";
    if (hasInterest('부동산'))
      return "다양한 자산에 관심이 많으시네요. 포트폴리오 리밸런싱과 부동산 비중 조절 전략을 함께 살펴봐요.";
    if (exp === 'stock')
      return "꾸준히 공부해오신 게 느껴져요. 포트폴리오 다각화와 배당 전략을 함께 점검해봐요.";
    return "꾸준히 성장해오셨군요! 포트폴리오 리밸런싱과 절세 고도화에 집중해보면 더 큰 성과를 낼 수 있어요.";
  }

  return "노밍이 분석 중이에요. 온보딩을 완료하면 맞춤 코칭을 받을 수 있어요!";
}

/* ── 온보딩 미완료 상태 ────────────────────────────────────── */
function EmptyProfile({ navigate, BASE_URL }) {
  return (
    <div className="anim-fade" style={{ textAlign: 'center', padding: '48px 0' }}>
      <img
        src={`${BASE_URL}coach.png`}
        alt="노밍"
        style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', margin: '0 auto 16px', display: 'block' }}
      />
      <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.6px', marginBottom: '8px' }}>
        아직 경제 프로필이 없어요
      </h2>
      <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7', marginBottom: '28px' }}>
        온보딩을 완료하면 노밍이<br />나에게 딱 맞는 코칭을 시작해요.
      </p>
      <button
        onClick={() => navigate('/onboarding')}
        style={{
          padding: '14px 32px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
          color: '#fff', border: 'none', fontSize: '15px', fontWeight: '800',
          cursor: 'pointer', letterSpacing: '-0.4px',
          boxShadow: '0 6px 20px rgba(33,197,142,0.35)',
        }}
      >
        온보딩 시작하기 →
      </button>
    </div>
  );
}

/* ── 메인 ─────────────────────────────────────────────────── */
export default function MyGrowthPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const BASE_URL = import.meta.env.BASE_URL;

  const xp        = profile?.xp ?? 0;
  const levelInfo = getNextLevelInfo(xp);
  const { currentLevel, nextLevel, xpProgress, xpTotal, xpNeeded, progressPercent } = levelInfo;
  const stageIndex = LEVELS.findIndex(l => l.key === currentLevel.key);

  const econInfo  = ECONOMIC_LEVEL[profile?.economic_level] ?? null;
  const invInfo   = INVESTMENT_EXP[profile?.investment_experience] ?? null;
  const occInfo   = OCCUPATION[profile?.occupation] ?? null;
  const interests = profile?.interests ?? [];
  const analysis  = generateAnalysis(profile);

  const isOnboarded = profile?.onboarding_completed === true;

  return (
    <PageWrapper>
      <div style={{ background: '#F2FBF5', minHeight: 'calc(100vh - 64px)', padding: '32px 0 64px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>

          {/* ── 페이지 제목 ─────────────────────────────── */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '4px' }}>
              나의 경제 프로필
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              {profile?.nickname ?? '사용자'}님의 경제 성장 여정이에요
            </p>
          </div>

          {!isOnboarded ? (
            <EmptyProfile navigate={navigate} BASE_URL={BASE_URL} />
          ) : (
            <div className="anim-fade">

              {/* ── 노밍 한 줄 분석 ──────────────────────── */}
              <div style={{
                background: 'linear-gradient(145deg, #FFFBEA, #FFF4CC)',
                border: '1.5px solid #FFE08A',
                borderRadius: '20px', padding: '20px 22px',
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                marginBottom: '16px',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={`${BASE_URL}coach.png`}
                    alt="노밍"
                    style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '13px', height: '13px', borderRadius: '50%',
                    background: '#52C97A', border: '2px solid #FFFBEA',
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#B45309', marginBottom: '6px', letterSpacing: '0.3px' }}>
                    ☀️ 노밍의 한 줄 분석
                  </p>
                  <p style={{ fontSize: '15px', color: '#78350F', lineHeight: '1.7', fontWeight: '500', letterSpacing: '-0.3px' }}>
                    {analysis}
                  </p>
                </div>
              </div>

              {/* ── 경제 수준 + 성장 단계 (2열) ─────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

                {/* 경제 수준 */}
                <div style={{
                  background: '#fff', borderRadius: '18px',
                  border: `1.5px solid ${econInfo?.border ?? '#E2E8F0'}`,
                  padding: '20px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '12px' }}>
                    경제 수준
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px' }}>{econInfo?.emoji ?? '❓'}</span>
                    <span style={{
                      fontSize: '18px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px',
                    }}>
                      {econInfo?.label ?? '미설정'}
                    </span>
                  </div>
                  {econInfo && (
                    <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', fontWeight: '500' }}>
                      {econInfo.desc}
                    </p>
                  )}
                  {econInfo && (
                    <div style={{
                      display: 'inline-block', marginTop: '10px',
                      fontSize: '11px', fontWeight: '700',
                      color: econInfo.color,
                      background: econInfo.bg,
                      border: `1px solid ${econInfo.border}`,
                      borderRadius: '100px', padding: '3px 10px',
                    }}>
                      {econInfo.label}
                    </div>
                  )}
                </div>

                {/* 성장 단계 */}
                <div style={{
                  background: '#fff', borderRadius: '18px',
                  border: '1.5px solid #DCF5EB',
                  padding: '20px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '12px' }}>
                    성장 단계
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px' }}>{currentLevel.emoji}</span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
                      {currentLevel.label} 단계
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px', fontWeight: '500' }}>
                    {xp} XP 획득
                    {nextLevel && ` · ${nextLevel.label}까지 ${xpNeeded} XP`}
                  </p>
                  {/* 진행률 바 */}
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '100px',
                      background: 'linear-gradient(90deg, #52C97A, #1AAD7D)',
                      width: `${progressPercent}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  {/* 단계 아이콘 미니 라인 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    {LEVELS.map((l, i) => {
                      const isCurrent = l.key === currentLevel.key;
                      const isPast    = i < stageIndex;
                      return (
                        <div key={l.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div style={{
                            width: isCurrent ? '26px' : '20px',
                            height: isCurrent ? '26px' : '20px',
                            borderRadius: '50%', flexShrink: 0,
                            background: isCurrent ? '#52C97A' : isPast ? '#DCF5EB' : '#F2FBF5',
                            border: isCurrent ? '2px solid #fff' : isPast ? '1.5px solid #A7F3D0' : '1.5px solid #E2E8F0',
                            boxShadow: isCurrent ? '0 0 0 3px rgba(33,197,142,0.2)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isCurrent ? '13px' : '10px',
                          }}>
                            {l.emoji}
                          </div>
                          {i < LEVELS.length - 1 && (
                            <div style={{
                              flex: 1, height: '2px', margin: '0 2px',
                              background: isPast ? '#52C97A' : '#E2E8F0',
                              borderRadius: '2px',
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── 투자 경험 + 현재 상황 (2열) ─────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1.5px solid #E2E8F0', padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '26px' }}>{invInfo?.emoji ?? '❓'}</span>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      투자 경험
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px' }}>
                      {invInfo?.label ?? '미설정'}
                    </p>
                  </div>
                </div>
                <div style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1.5px solid #E2E8F0', padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '26px' }}>{occInfo?.emoji ?? '❓'}</span>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      현재 상황
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px' }}>
                      {occInfo?.label ?? '미설정'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 관심 분야 ─────────────────────────────── */}
              <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1.5px solid #E2E8F0', padding: '18px 20px',
                marginBottom: '20px',
              }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.8px', marginBottom: '12px' }}>
                  관심 분야
                </p>
                {interests.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {interests.map(tag => (
                      <span key={tag} style={{
                        fontSize: '13px', fontWeight: '700', color: '#52C97A',
                        background: '#F2FBF5', border: '1.5px solid #DCF5EB',
                        borderRadius: '100px', padding: '6px 14px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>관심 분야가 설정되지 않았어요.</p>
                )}
              </div>

              {/* ── 하단 버튼 ─────────────────────────────── */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate('/coach')}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #52C97A, #1AAD7D)',
                    color: '#fff', border: 'none', fontSize: '14px', fontWeight: '800',
                    cursor: 'pointer', letterSpacing: '-0.3px',
                    boxShadow: '0 4px 16px rgba(33,197,142,0.3)',
                  }}
                >
                  ☀️ 노밍에게 질문하기
                </button>
                <button
                  onClick={() => navigate('/onboarding')}
                  style={{
                    padding: '14px 20px', borderRadius: '14px',
                    background: '#fff', color: '#64748B',
                    border: '1.5px solid #E2E8F0', fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#52C97A'; e.currentTarget.style.color = '#52C97A'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}
                >
                  프로필 다시 설정
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
