import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BookMarked, Search, Leaf, MessageCircle, Newspaper, Sun, Shield, ChevronRight, ChevronDown, Flame } from 'lucide-react';
import { generateTodayAction } from '../services/onboardingService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { LEVELS, getNextLevelInfo } from '../data/levelData';
import { useDictionaryCtx } from '../context/DictionaryContext';
import { DiaryContent } from './DiaryPage';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 정적 매핑 ────────────────────────────────────────────── */
const ECONOMIC_LEVEL = {
  beginner:     { label: '입문자', emoji: '🌱', color: 'var(--c-green-500)', bg: 'var(--c-green-50)', border: 'var(--c-green-100)', desc: '경제 공부를 이제 막 시작하시는 분' },
  elementary:   { label: '초급자', emoji: '📖', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', desc: '기본 용어는 알지만 뉴스가 아직 어려운 분' },
  intermediate: { label: '중급자', emoji: '📚', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', desc: '기본 개념은 알고 더 깊이 배우고 싶은 분' },
  advanced:     { label: '고급자', emoji: '🔍', color: 'var(--c-yellow-500)', bg: 'var(--c-yellow-100)', border: 'var(--c-yellow-border)', desc: '꾸준히 공부 중이며 심화 내용에 관심 있는 분' },
  expert:       { label: '전문가', emoji: '🏆', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', desc: '경제를 깊이 이해하고 투자 전략까지 세우는 분' },
};
const INVESTMENT_EXP = {
  none:  { label: '투자 경험 없음',      emoji: '🤔' },
  etf:   { label: 'ETF 투자 경험 있음',  emoji: '📈' },
  stock: { label: '주식 투자 경험 있음', emoji: '💹' },
};
const OCCUPATION = {
  student:    { label: '학생',     emoji: '🎓' },
  employee:   { label: '직장인',   emoji: '💼' },
  freelancer: { label: '프리랜서', emoji: '💻' },
  business:   { label: '사업자',   emoji: '🏢' },
};
const PROVIDER_LABEL = { google: 'Google', kakao: '카카오', email: '이메일' };

/* ── 노밍 분석 ────────────────────────────────────────────── */
function generateAnalysis(profile) {
  const level     = profile?.economic_level;
  const exp       = profile?.investment_experience;
  const interests = profile?.interests ?? [];
  const has       = (k) => interests.includes(k);
  if (!level) return "온보딩을 완료하면 노밍의 맞춤 분석을 받을 수 있어요!";
  if (level === 'beginner') {
    if (has('투자') && has('저축')) return "저축과 투자 둘 다 관심이 있으시네요. 투자 전에 비상금을 먼저 마련하는 게 핵심이에요!";
    if (has('투자') || has('ETF 기초')) return "먼저 비상금 3개월치를 파킹통장에 모아두고, 그다음 ETF 기초부터 시작해봐요.";
    if (has('저축')) return "저축부터 시작하는 건 최고의 선택이에요! 파킹통장과 적금 차이를 먼저 알아보면 좋아요.";
    return "경제 공부, 이제 막 시작하셨군요. 지금 내 돈의 흐름을 파악하는 것부터 시작해보세요.";
  }
  if (level === 'elementary') {
    if (has('투자')) return "기본 개념은 잡혔네요! ETF 기초부터 시작해 적립식 투자를 차근차근 해봐요.";
    if (has('저축')) return "목돈 마련 목표를 세우고 예금·적금을 비교해서 활용해봐요.";
    return "기초 지식을 바탕으로 이제 본격적인 재무 계획을 세워봐요!";
  }
  if (level === 'intermediate') {
    if (exp === 'etf')   return "ETF 경험이 있으시네요! 적립식 투자를 이어가면서 IRP·연금저축 절세 전략도 챙겨봐요.";
    if (exp === 'stock') return "주식 경험도 있으시네요. ETF 비중을 늘려가는 전략을 고려해보는 건 어떨까요?";
    if (has('세금'))     return "IRP와 연금저축 조합으로 매년 세금을 절약해봐요.";
    return "어느 정도 기초가 잡혀 있으시네요! ETF 심화나 절세 전략에 도전해봐요.";
  }
  if (level === 'advanced') {
    if (has('세금'))     return "IRP·연금저축 절세 극대화와 금융소득 종합과세 대비를 점검해보면 좋을 것 같아요.";
    if (exp === 'stock') return "포트폴리오 다각화와 배당 전략을 함께 점검해봐요.";
    return "꾸준히 성장해오셨군요! 포트폴리오 리밸런싱과 절세 고도화에 집중해봐요.";
  }
  if (level === 'expert') {
    if (has('세금'))     return "탁월한 이해도네요! 금융소득 종합과세 대비와 절세 포트폴리오 고도화에 집중해봐요.";
    return "경제를 깊이 이해하고 계시네요! 포트폴리오 최적화와 글로벌 자산배분 전략을 탐구해봐요.";
  }
  return "노밍이 분석 중이에요. 온보딩을 완료하면 맞춤 코칭을 받을 수 있어요!";
}


/* ── 요약 탭 ──────────────────────────────────────────────── */
function SummaryTab() {
  const navigate  = useNavigate();
  const { user, profile, signOut } = useAuth();
  const BASE_URL  = import.meta.env.BASE_URL;

  const provider    = user?.app_metadata?.provider || user?.identities?.[0]?.provider || 'unknown';
  const xp          = profile?.xp ?? 0;
  const levelInfo   = getNextLevelInfo(xp);
  const { currentLevel, nextLevel, xpNeeded, progressPercent } = levelInfo;
  const stageIndex      = LEVELS.findIndex(l => l.key === currentLevel.key);
  const overallProgress = (stageIndex + progressPercent / 100) / (LEVELS.length - 1);
  const econInfo    = ECONOMIC_LEVEL[profile?.economic_level] ?? null;
  const invInfo     = INVESTMENT_EXP[profile?.investment_experience] ?? null;
  const occInfo     = OCCUPATION[profile?.occupation] ?? null;
  const interests   = profile?.interests ?? [];
  const isOnboarded = profile?.onboarding_completed === true;

  const handleSignOut = async () => { await signOut(); navigate('/home'); };

  return (
    <div>
      {/* ── 2. 성장 단계 ── */}
      <div style={{ background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px solid var(--c-line)', padding: '20px', marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.8px', marginBottom: '14px' }}>성장 단계</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <currentLevel.Icon size={36} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '17px', fontWeight: '900', color: 'var(--c-forest-700)', letterSpacing: '-0.5px' }}>{currentLevel.label} 단계</p>
            <p style={{ fontSize: '13px', color: 'var(--c-muted)', fontWeight: '500' }}>
              {xp} XP 획득 {nextLevel ? `· ${nextLevel.label}까지 ${xpNeeded} XP 남음` : '· 🏆 최고 단계 달성!'}
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', height: '36px', marginBottom: '4px' }}>
          {/* 트랙 배경 */}
          <div style={{ position: 'absolute', left: '14px', right: '14px', top: '50%', transform: 'translateY(-50%)', height: '5px', background: 'var(--c-line-soft)', borderRadius: '100px' }} />
          {/* 진행 채움 */}
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', height: '5px', background: 'linear-gradient(90deg,var(--c-green-500),var(--c-green-500))', borderRadius: '100px', width: `calc(${overallProgress.toFixed(4)} * (100% - 28px))`, transition: 'width 0.6s' }} />
          {/* 아이콘 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            {LEVELS.map((l, i) => {
              const isCurrent = l.key === currentLevel.key;
              const isPast    = i < stageIndex;
              return (
                <l.Icon
                  key={l.key}
                  title={l.label}
                  size={isCurrent ? 32 : 26}
                  style={{
                    flexShrink: 0,
                    opacity: isCurrent ? 1 : isPast ? 0.85 : 0.3,
                    filter: isCurrent ? 'drop-shadow(0 0 4px rgba(33,197,142,0.5))' : 'none',
                    transition: 'all 0.3s',
                    position: 'relative', zIndex: 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 연속 학습일 ── */}
      {(profile?.streak_days ?? 0) > 0 && (
        <div style={{
          background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px solid var(--c-line)',
          padding: '16px 20px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={22} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: '17px', fontWeight: '900', color: 'var(--c-ink)', letterSpacing: '-0.5px' }}>
              {profile.streak_days}일 연속 학습 중
            </p>
            <p style={{ fontSize: '12px', color: 'var(--c-muted)', fontWeight: '500' }}>
              매일 한 잎씩, 꾸준히 잘 하고 있어요!
            </p>
          </div>
        </div>
      )}

      {/* ── 3. 경제 프로필 ── */}
      {isOnboarded ? (
        <div style={{ background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px solid var(--c-line)', padding: '14px 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.8px' }}>경제 프로필</p>
            <button
              onClick={() => navigate('/onboarding')}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--c-muted)', cursor: 'pointer', fontWeight: '600', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--c-green-500)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
            >
              ✏️ 수정
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            {econInfo && (
              <div style={{ flex: 1, paddingRight: '8px', borderRight: '1px solid var(--c-green-50)' }}>
                <p style={{ fontSize: '10px', color: 'var(--c-muted)', marginBottom: '3px' }}>경제 수준</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-forest-700)', lineHeight: 1.2 }}>{econInfo.label}</p>
              </div>
            )}
            {invInfo && (
              <div style={{ flex: 1, padding: '0 8px', borderRight: '1px solid var(--c-green-50)' }}>
                <p style={{ fontSize: '10px', color: 'var(--c-muted)', marginBottom: '3px' }}>투자 경험</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-forest-700)', lineHeight: 1.2 }}>{invInfo.label}</p>
              </div>
            )}
            {occInfo && (
              <div style={{ flex: 1, padding: '0 8px', borderRight: interests.length > 0 ? '1px solid var(--c-green-50)' : 'none' }}>
                <p style={{ fontSize: '10px', color: 'var(--c-muted)', marginBottom: '3px' }}>현재 상황</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-forest-700)', lineHeight: 1.2 }}>{occInfo.label}</p>
              </div>
            )}
            {interests.length > 0 && (
              <div style={{ flex: 1, paddingLeft: '8px' }}>
                <p style={{ fontSize: '10px', color: 'var(--c-muted)', marginBottom: '3px' }}>관심 분야</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-forest-700)', lineHeight: 1.2 }}>
                  {interests.slice(0, 2).join(', ')}{interests.length > 2 ? ` +${interests.length - 2}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px dashed var(--c-line)', padding: '28px', textAlign: 'center', marginBottom: '16px' }}>
          <Sun size={44} color="#F59E0B" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '5px' }}>경제 성장 진단을 완료해보세요</p>
          <p style={{ fontSize: '13px', color: 'var(--c-muted)', lineHeight: '1.6', marginBottom: '16px' }}>온보딩을 완료하면 노밍이 맞춤 코칭을 시작해요.</p>
          <button onClick={() => navigate('/diagnosis')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,var(--c-green-500),var(--c-green-500))', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(33,197,142,0.3)' }}>
            진단 시작하기 →
          </button>
        </div>
      )}


      {/* ── 로그아웃 ── */}
      <button
        onClick={handleSignOut}
        style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--c-canvas)', color: 'var(--c-warn)', border: '0.5px solid var(--c-line)', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
      >
        로그아웃
      </button>
    </div>
  );
}

/* ── 출처 뱃지 맵 ─────────────────────────────────────────── */
const SOURCE_STYLE = {
  economic_bite: { label: '경제 한잎', Icon: Leaf,          bg: 'var(--c-green-50)', color: 'var(--c-forest-700)', border: 'var(--c-green-300)' },
  coach:         { label: '노밍 대화', Icon: MessageCircle, bg: 'var(--c-yellow-100)', color: 'var(--c-amber-700)', border: 'var(--c-yellow-border)' },
  news:          { label: '경제 읽기', Icon: Newspaper,     bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
};

/* ── 용어 카드 (새 스키마) ────────────────────────────────── */
function TermCard({ term, onDelete, deleting }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const src = SOURCE_STYLE[term.sourceType] ?? { label: '기타', icon: '📖', bg: 'var(--c-surface)', color: 'var(--c-muted)', border: 'var(--c-line)' };

  return (
    <div style={{
      background: 'var(--c-surface)', border: '0.5px solid var(--c-line)',
      borderRadius: '12px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* 용어명 + 출처 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--c-forest-700)', letterSpacing: '-0.4px', lineHeight: 1.3 }}>
          {term.term}
        </p>
        <span style={{
          fontSize: '10px', fontWeight: '700', flexShrink: 0,
          background: src.bg, color: src.color, border: `1px solid ${src.border}`,
          borderRadius: '100px', padding: '2px 8px',
          display: 'inline-flex', alignItems: 'center', gap: '3px',
        }}>
          <src.Icon size={10} /> {src.label}
        </span>
      </div>

      {/* 뜻 */}
      {term.meaning && (
        <p style={{ fontSize: '12px', color: 'var(--c-slate)', lineHeight: '1.65' }}>
          {term.meaning.length > 90 ? term.meaning.slice(0, 90) + '…' : term.meaning}
        </p>
      )}

      {/* 저장일 + 삭제 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <span style={{ fontSize: '11px', color: 'var(--c-muted)', fontWeight: '500' }}>{term.savedAt}</span>
        {confirmDel ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setConfirmDel(false)}
              style={{ padding: '4px 10px', borderRadius: '7px', background: 'var(--c-surface)', border: '0.5px solid var(--c-line)', fontSize: '11px', fontWeight: '600', color: 'var(--c-muted)', cursor: 'pointer' }}
            >
              취소
            </button>
            <button
              onClick={() => onDelete(term.id)} disabled={deleting}
              style={{ padding: '4px 10px', borderRadius: '7px', background: '#FEF2F2', border: '1.5px solid #FECACA', fontSize: '11px', fontWeight: '700', color: '#DC2626', cursor: deleting ? 'not-allowed' : 'pointer' }}
            >
              {deleting ? '…' : '삭제'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDel(true)}
            style={{ padding: '4px 10px', borderRadius: '7px', background: 'none', border: '0.5px solid var(--c-line)', fontSize: '11px', fontWeight: '600', color: 'var(--c-muted)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-line)'; e.currentTarget.style.color = 'var(--c-muted)'; }}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 나만의 경제사전 탭 ────────────────────────────────────── */
function DictionaryTabContent() {
  const { terms, loaded, remove } = useDictionaryCtx();
  const [search,     setSearch]     = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id);
    await remove(id);
    setDeletingId(null);
  }

  const filtered = terms.filter(t =>
    !search ||
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    (t.meaning || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* 검색 */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={15} color="var(--c-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="용어 검색..."
          style={{
            width: '100%', padding: '12px 16px 12px 42px', boxSizing: 'border-box',
            borderRadius: '14px', border: '0.5px solid var(--c-line)',
            fontSize: '14px', color: 'var(--c-forest-700)', background: 'var(--c-surface)',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--c-green-500)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--c-line)'}
        />
      </div>

      {!loaded ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--c-muted)', fontSize: '13px' }}>
          불러오는 중…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px solid var(--c-line)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <BookMarked size={32} color="var(--c-muted)" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--c-forest-700)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            {search ? '검색 결과가 없어요' : '아직 저장한 용어가 없어요'}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--c-muted)', lineHeight: '1.7' }}>
            {search
              ? '다른 검색어를 시도해보세요.'
              : '경제 한잎·노밍 대화·경제 읽기에서\n용어 옆 ＋ 버튼을 눌러 저장해보세요.'}
          </p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.4px', marginBottom: '12px' }}>
            {search ? `"${search}" 검색 결과 · ` : ''}{filtered.length}개
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {filtered.map(term => (
              <TermCard
                key={term.id}
                term={term}
                onDelete={handleDelete}
                deleting={deletingId === term.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


/* ── 경제 자립 탭 ─────────────────────────────────────────── */
const INDEPENDENCE_LEVEL_COLOR = {
  seed:   '#78909C',
  sprout: '#66BB6A',
  leaf:   '#26A69A',
  flower: '#AB47BC',
  fruit:  '#FFA726',
};

function IndependenceTab() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const BASE_URL = import.meta.env.BASE_URL;

  const [todayAction,    setTodayAction]    = useState(profile?.today_action ?? null);
  const [actionLoading,  setActionLoading]  = useState(false);
  const [completedSteps, setCompletedSteps] = useState(profile?.roadmap_completed_steps ?? []);
  const [expandedStep,   setExpandedStep]   = useState(null);
  const [addingStep,     setAddingStep]     = useState(null);
  const [newTodoText,    setNewTodoText]    = useState('');
  const [customTodos,    setCustomTodos]    = useState(profile?.roadmap_custom_todos ?? {});

  const diagnosis = profile?.independence_diagnosis ?? null;
  const roadmap   = profile?.independence_roadmap   ?? null;
  const score     = profile?.independence_score     ?? null;
  const totalSteps = roadmap?.steps?.length ?? 1;
  const progress   = Math.round((completedSteps.length / totalSteps) * 100);

  /* 단계 완료 토글 */
  const toggleStepComplete = async (stepOrder) => {
    const isCompleted = completedSteps.includes(stepOrder);
    const previous = completedSteps;
    const updated = isCompleted
      ? completedSteps.filter(s => s !== stepOrder)
      : [...completedSteps, stepOrder];

    setCompletedSteps(updated);

    const { error } = await supabase
      .from('profiles')
      .update({ roadmap_completed_steps: updated })
      .eq('id', user.id);

    if (error) {
      console.error('완료 상태 저장 실패:', error);
      setCompletedSteps(previous);
      alert('저장에 실패했어요. 다시 시도해주세요.');
      return;
    }

    if (!isCompleted && updated.length === totalSteps) {
      setTimeout(() => alert('모든 단계를 완료했어요! 노밍이 자랑스러워요!'), 100);
    }
  };

  /* 커스텀 할일 저장 — 실패 시 이전 상태로 롤백 + 알림 */
  const persistCustomTodos = async (updated, previous) => {
    const { error } = await supabase.from('profiles').update({ roadmap_custom_todos: updated }).eq('id', user.id);
    if (error) {
      console.error('커스텀 할일 저장 실패:', error);
      setCustomTodos(previous);
      alert('저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  /* 커스텀 할일 추가 */
  const addCustomTodo = async (stepOrder) => {
    if (!newTodoText.trim()) return;
    const previous = customTodos;
    const newTodo = { id: Date.now().toString(), text: newTodoText.trim(), done: false, createdAt: new Date().toISOString() };
    const updated = { ...customTodos, [stepOrder]: [...(customTodos[stepOrder] ?? []), newTodo] };
    setCustomTodos(updated);
    setNewTodoText('');
    setAddingStep(null);
    await persistCustomTodos(updated, previous);
  };

  /* 커스텀 할일 완료 토글 */
  const toggleCustomTodo = async (stepOrder, todoId) => {
    const previous = customTodos;
    const updated = { ...customTodos, [stepOrder]: customTodos[stepOrder].map(t => t.id === todoId ? { ...t, done: !t.done } : t) };
    setCustomTodos(updated);
    await persistCustomTodos(updated, previous);
  };

  /* 커스텀 할일 삭제 */
  const deleteCustomTodo = async (stepOrder, todoId) => {
    const previous = customTodos;
    const updated = { ...customTodos, [stepOrder]: customTodos[stepOrder].filter(t => t.id !== todoId) };
    setCustomTodos(updated);
    await persistCustomTodos(updated, previous);
  };

  /* 오늘의 행동 — 미완료 첫 단계 기반으로 갱신 */
  useEffect(() => {
    if (!user?.id || !diagnosis) return;
    const today = new Date().toISOString().slice(0, 10);
    if (profile?.today_action_date === today && profile?.today_action) {
      setTodayAction(profile.today_action);
      return;
    }
    setActionLoading(true);
    const currentStep = roadmap?.steps?.find(s => !completedSteps.includes(s.order));
    generateTodayAction(user.id, profile?.financial_goal, diagnosis.level, currentStep)
      .then(action => { setTodayAction(action); refreshProfile(); })
      .catch(() => {})
      .finally(() => setActionLoading(false));
  }, [user?.id]); // eslint-disable-line

  const levelColor = INDEPENDENCE_LEVEL_COLOR[diagnosis?.level] ?? 'var(--c-green-500)';

  return (
    <div>
      {/* 자립 진단 결과 카드 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Shield size={13} color="#3A9A5C" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#3A9A5C', letterSpacing: '0.3px' }}>경제 자립 진단</span>
        </div>

        {diagnosis && score !== null ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: levelColor, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', flexShrink: 0,
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{score}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>/ 50</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2A7A4B' }}>{diagnosis.label}</div>
                <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>{diagnosis.desc}</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/independence')}
              style={{ width: '100%', padding: '8px', borderRadius: 8, background: '#F2FBF5', border: '0.5px solid #B8EBC8', color: '#2A7A4B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              재진단하기 →
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/independence')}
            style={{ width: '100%', padding: 12, borderRadius: 8, background: 'var(--grad-action)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(33,197,142,0.3)' }}
          >
            경제 자립 진단 시작하기 →
          </button>
        )}
      </div>

      {/* 자립 로드맵 */}
      {roadmap && (
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid #B8EBC8', padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={13} color="#3A9A5C" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3A9A5C', letterSpacing: '0.3px' }}>나의 자립 로드맵</span>
            </div>
            <span style={{ fontSize: 11, color: '#52C97A', fontWeight: 600 }}>
              {completedSteps.length}/{totalSteps} 완료
            </span>
          </div>

          {/* 진행률 바 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#888780' }}>진행률</span>
              <span style={{ fontSize: 11, color: '#52C97A', fontWeight: 600 }}>{progress}%</span>
            </div>
            <div style={{ background: '#E3F9EC', borderRadius: 20, height: 6 }}>
              <div style={{
                background: '#52C97A', height: 6, borderRadius: 20,
                width: `${progress}%`, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#2A7A4B', fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
            {roadmap.goalPath}
          </div>

          {(roadmap.steps ?? []).map((step, i) => {
            const isDone    = completedSteps.includes(step.order);
            const isExpanded = expandedStep === step.order;
            return (
              <div key={i} style={{
                borderBottom: i < roadmap.steps.length - 1 ? '0.5px solid #f0f7f3' : 'none',
                opacity: isDone ? 0.65 : 1,
                transition: 'opacity 0.2s',
              }}>
                {/* ── 헤더 행 (클릭으로 펼치기) ── */}
                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.order)}
                  style={{ display: 'flex', gap: 10, padding: '12px 0', cursor: 'pointer', alignItems: 'center' }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isDone ? '#52C97A' : '#E3F9EC',
                    color: isDone ? '#fff' : '#3A9A5C',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    border: '0.5px solid #B8EBC8', transition: 'background 0.2s',
                  }}>
                    {isDone ? '✓' : step.order}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: '#2A7A4B',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}>
                      {step.title}
                    </div>
                    {!isExpanded && (
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>
                        {step.category}{step.estimatedDays ? ` · ${step.estimatedDays}일` : ''}
                      </div>
                    )}
                  </div>

                  <ChevronDown
                    size={15} color="#B8C8BE"
                    style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </div>

                {/* ── 펼쳐진 상세 내용 ── */}
                {isExpanded && (
                  <div style={{ paddingBottom: 16, paddingLeft: 38 }}>

                    {/* 설명 */}
                    {step.description && (
                      <div style={{ fontSize: 13, color: '#444', lineHeight: 1.75, marginBottom: 12 }}>
                        {step.description}
                      </div>
                    )}

                    {/* 왜 중요한지 */}
                    {step.why && (
                      <div style={{ background: '#F0FBF4', borderRadius: 8, border: '0.5px solid #B8EBC8', padding: '10px 12px', marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#3A9A5C', marginBottom: 4, letterSpacing: '0.3px' }}>왜 중요한가요?</div>
                        <div style={{ fontSize: 12, color: '#2A7A4B', lineHeight: 1.65 }}>{step.why}</div>
                      </div>
                    )}

                    {/* 행동 목록 — 객체 형식(today/this_week/this_month) 또는 배열 형식 모두 지원 */}
                    {step.actions && (
                      <div style={{ marginBottom: 4 }}>
                        {typeof step.actions === 'object' && !Array.isArray(step.actions) ? (
                          <>
                            {step.actions.today && (
                              <div style={{ background: '#E3F9EC', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#2A7A4B', marginBottom: 4 }}>⚡ 지금 당장 (5분)</div>
                                <div style={{ fontSize: 12, color: '#2A7A4B', lineHeight: 1.65 }}>{step.actions.today}</div>
                              </div>
                            )}
                            {step.actions.this_week && (
                              <div style={{ background: '#F2FBF5', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#3A9A5C', marginBottom: 4 }}>📅 이번 주 안에</div>
                                <div style={{ fontSize: 12, color: '#3A9A5C', lineHeight: 1.65 }}>{step.actions.this_week}</div>
                              </div>
                            )}
                            {step.actions.this_month && (
                              <div style={{ background: '#F2FBF5', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#888780', marginBottom: 4 }}>🗓️ 이번 달 안에</div>
                                <div style={{ fontSize: 12, color: '#888780', lineHeight: 1.65 }}>{step.actions.this_month}</div>
                              </div>
                            )}
                          </>
                        ) : Array.isArray(step.actions) && step.actions.length > 0 && (
                          step.actions.map((action, j) => (
                            <div key={j} style={{ background: j === 0 ? '#E3F9EC' : '#F2FBF5', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: j === 0 ? '#2A7A4B' : '#3A9A5C', marginBottom: 4 }}>
                                {j === 0 ? '⚡ 지금 당장' : j === 1 ? '📅 이번 주 안에' : '🗓️ 이번 달 안에'}
                              </div>
                              <div style={{ fontSize: 12, color: j === 0 ? '#2A7A4B' : '#3A9A5C', lineHeight: 1.65 }}>{action}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* 완료 기준 */}
                    {step.checkPoints?.length > 0 && (
                      <div style={{ borderTop: '0.5px solid #E3F9EC', paddingTop: 10, marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#888780', marginBottom: 8, letterSpacing: '0.3px' }}>이렇게 되면 완료예요</div>
                        {step.checkPoints.map((cp, j) => (
                          <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
                            <span style={{ color: '#52C97A', fontWeight: 700, fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>✓</span>
                            <span style={{ fontSize: 12, color: '#2A7A4B', lineHeight: 1.6 }}>{cp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 노밍 팁 */}
                    {step.nomingTip && (
                      <div style={{
                        background: '#FFFBEE', borderRadius: 8,
                        border: '0.5px solid #FAC775',
                        padding: '10px 12px', marginBottom: 12,
                        display: 'flex', gap: 8, alignItems: 'flex-start',
                      }}>
                        <Sun size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#854F0B', marginBottom: 3 }}>노밍 팁</div>
                          <div style={{ fontSize: 11, color: '#633806', lineHeight: 1.65 }}>{step.nomingTip}</div>
                        </div>
                      </div>
                    )}

                    {/* 관련 경제한잎 */}
                    {step.relatedBites?.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#888780', marginBottom: 6, letterSpacing: '0.3px' }}>관련 경제한잎</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {step.relatedBites.map((kw, j) => (
                            <button
                              key={j}
                              onClick={(e) => { e.stopPropagation(); navigate('/coach', { state: { question: `${kw}에 대해 알려줘` } }); }}
                              style={{
                                padding: '4px 10px', borderRadius: 20,
                                background: '#E3F9EC', border: '0.5px solid #B8EBC8',
                                fontSize: 11, color: '#2A7A4B', fontWeight: 600, cursor: 'pointer',
                              }}
                            >
                              {kw} →
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 완료하기 버튼 */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStepComplete(step.order); if (!isDone) setExpandedStep(null); }}
                      style={{
                        width: '100%', padding: '10px', borderRadius: 10,
                        background: isDone ? '#F2FBF5' : 'var(--grad-action)',
                        border: isDone ? '0.5px solid #B8EBC8' : 'none',
                        color: isDone ? '#3A9A5C' : '#fff',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        boxShadow: isDone ? 'none' : '0 4px 14px rgba(33,197,142,0.25)',
                      }}
                    >
                      {isDone ? '완료 취소하기' : '이 단계 완료하기 ✓'}
                    </button>

                    {/* 내 계획 추가 */}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, color: '#888780', marginBottom: 8 }}>📝 내가 추가한 계획</div>

                      {(customTodos[step.order] ?? []).map(todo => (
                        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '0.5px solid #f0f7f3' }}>
                          <div
                            onClick={() => toggleCustomTodo(step.order, todo.id)}
                            style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                              background: todo.done ? '#52C97A' : '#fff',
                              border: '1.5px solid ' + (todo.done ? '#52C97A' : '#B8EBC8'),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            {todo.done && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 12, flex: 1, color: '#2A7A4B', textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.6 : 1 }}>
                            {todo.text}
                          </span>
                          <button
                            onClick={() => deleteCustomTodo(step.order, todo.id)}
                            style={{ background: 'none', border: 'none', color: '#B8EBC8', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {addingStep === step.order ? (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <input
                            autoFocus
                            value={newTodoText}
                            onChange={e => setNewTodoText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomTodo(step.order)}
                            placeholder="예: 부동산 책 한 권 읽기"
                            style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #52C97A', fontSize: 12, outline: 'none', background: '#fff', fontFamily: 'inherit' }}
                          />
                          <button
                            onClick={() => addCustomTodo(step.order)}
                            style={{ padding: '7px 12px', borderRadius: 8, background: '#52C97A', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            추가
                          </button>
                          <button
                            onClick={() => { setAddingStep(null); setNewTodoText(''); }}
                            style={{ padding: '7px 10px', borderRadius: 8, background: '#F2FBF5', border: '0.5px solid #B8EBC8', color: '#888780', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingStep(step.order)}
                          style={{ width: '100%', marginTop: 8, padding: '7px', borderRadius: 8, border: '1px dashed #B8EBC8', background: 'transparent', color: '#888780', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                        >
                          + 내 계획 추가하기
                        </button>
                      )}
                    </div>

                    {/* 노밍 바로 질문하기 */}
                    <button
                      onClick={() => navigate('/coach', {
                        state: {
                          question: `${step.title}에 대해 더 자세히 알고 싶어요. ${step.description}`,
                          context: `자립 로드맵 ${step.order}단계`,
                        }
                      })}
                      style={{
                        width: '100%', marginTop: 10,
                        padding: '9px 12px', borderRadius: 8,
                        background: '#FFFBEE', border: '0.5px solid #FAC775',
                        color: '#854F0B', fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontFamily: 'inherit',
                      }}
                    >
                      <img src={`${BASE_URL}noming.png`} style={{ width: 18, height: 18, objectFit: 'contain' }} alt="" />
                      노밍에게 이 단계 더 물어보기 →
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {roadmap.warning && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#FFF8E1', borderRadius: 8, border: '0.5px solid #FFE082', fontSize: 11, color: '#F57F17', lineHeight: 1.5 }}>
              {roadmap.warning}
            </div>
          )}
        </div>
      )}

      {/* 오늘의 행동 제안 */}
      {(todayAction || actionLoading) && (
        <div style={{ background: '#FFFBEE', borderRadius: 12, border: '0.5px solid #FAC775', padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#854F0B', marginBottom: 8, letterSpacing: '0.3px' }}>
            오늘의 행동 제안
          </div>
          {actionLoading ? (
            <div style={{ height: 36, background: 'rgba(250,199,117,0.2)', borderRadius: 6, backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg,rgba(250,199,117,0.1) 25%,rgba(250,199,117,0.3) 50%,rgba(250,199,117,0.1) 75%)', animation: 'shimmer 1.5s infinite' }} />
          ) : (
            <div style={{ fontSize: 13, color: '#633806', lineHeight: 1.7 }}>{todayAction}</div>
          )}
        </div>
      )}

      {/* 진단 전 안내 */}
      {!diagnosis && (
        <div style={{ background: 'var(--c-surface)', borderRadius: 12, border: '0.5px solid var(--c-line)', padding: 20, textAlign: 'center', marginTop: 12 }}>
          <Shield size={32} color="var(--c-muted)" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-forest-700)', marginBottom: 6 }}>재무 자립도를 진단해보세요</p>
          <p style={{ fontSize: 12, color: 'var(--c-muted)', lineHeight: 1.6 }}>10문항으로 나의 경제 자립 수준을<br />파악하고 맞춤 로드맵을 받아봐요.</p>
        </div>
      )}
    </div>
  );
}

/* ── 탭 카드 설정 ─────────────────────────────────────────── */
const TAB_CARDS = [
  { key: 'summary',      label: '요약',    Icon: LayoutDashboard },
  { key: 'independence', label: '경제자립', Icon: Shield },
  { key: 'diary',        label: '경제일기', Icon: BookOpen },
  { key: 'dictionary',   label: '경제사전', Icon: BookMarked },
];

/* ── 메인 ─────────────────────────────────────────────────── */
export default function MyGrowthHubPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab ?? 'summary');

  if (!user) {
    return (
      <PageWrapper>
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--c-muted)', marginBottom: '16px' }}>로그인이 필요해요.</p>
          <button onClick={() => navigate('/login')} style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,var(--c-green-500),var(--c-green-500))', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            로그인하기
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ background: 'var(--c-canvas)' }}>

        {/* 탭 카드 + 콘텐츠 */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px 20px 80px' }}>

          {/* 카드 그리드 */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px', marginBottom: '16px',
          }}>
            {TAB_CARDS.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    borderRadius: '12px', padding: '10px 6px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '6px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: isActive ? 'none' : '0.5px solid var(--c-line)',
                    background: isActive ? 'var(--c-green-500)' : 'var(--c-surface)',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--c-canvas)',
                  }}>
                    <Icon size={20} color={isActive ? '#fff' : 'var(--c-forest-700)'} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#fff' : 'var(--c-forest-700)',
                    letterSpacing: '-0.2px',
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'summary'      && <SummaryTab />}
          {activeTab === 'independence' && <IndependenceTab />}
          {activeTab === 'diary'        && <DiaryContent />}
          {activeTab === 'dictionary'   && <DictionaryTabContent />}
        </div>

      </div>
    </PageWrapper>
  );
}
