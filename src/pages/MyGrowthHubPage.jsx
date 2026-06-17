import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BookMarked, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LEVELS, getNextLevelInfo } from '../data/levelData';
import { roadmap } from '../data/roadmapData';
import { useDictionaryCtx } from '../context/DictionaryContext';
import { DiaryContent } from './DiaryPage';
import PageWrapper from '../components/layout/PageWrapper';

/* ── 정적 매핑 ────────────────────────────────────────────── */
const ECONOMIC_LEVEL = {
  beginner:     { label: '초급자', emoji: '🌱', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', desc: '경제 공부를 이제 막 시작하시는 분' },
  intermediate: { label: '중급자', emoji: '📚', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', desc: '기본 개념은 알고 더 깊이 배우고 싶은 분' },
  advanced:     { label: '고급자', emoji: '🔍', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', desc: '꾸준히 공부 중이며 심화 내용에 관심 있는 분' },
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
  return "노밍이 분석 중이에요. 온보딩을 완료하면 맞춤 코칭을 받을 수 있어요!";
}

/* ── 개발자 정보 아코디언 ─────────────────────────────────── */
function DevInfo({ user, profile, provider }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: '0.5px solid #B8EBC8',
          borderRadius: open ? '12px 12px 0 0' : '12px',
          padding: '12px 16px', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#888780' }}>🛠 개발자 정보 보기</span>
        <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '600' }}>{open ? '닫기 ↑' : '펼치기 ↓'}</span>
      </button>
      {open && (
        <div style={{ border: '0.5px solid #B8EBC8', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
          {[
            { k: 'user.id',    v: user?.id },
            { k: 'email',      v: user?.email || '(소셜 로그인)' },
            { k: 'provider',   v: provider },
            { k: 'level',      v: profile?.level },
            { k: 'xp',         v: String(profile?.xp ?? 0) },
            { k: 'created_at', v: profile?.created_at?.slice(0, 10) },
          ].map(({ k, v }) => (
            <div key={k} style={{ display: 'flex', gap: '12px', padding: '10px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#888780', fontFamily: 'monospace', minWidth: '100px', flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: '12px', color: '#5F5E5A', fontFamily: 'monospace', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}
          <details style={{ padding: '10px 16px' }}>
            <summary style={{ fontSize: '11px', color: '#888780', cursor: 'pointer', fontWeight: '700', fontFamily: 'monospace' }}>user_metadata</summary>
            <pre style={{ margin: '8px 0 0', fontSize: '11px', color: '#5F5E5A', lineHeight: '1.6', overflowX: 'auto' }}>
              {JSON.stringify(user?.user_metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
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
  const stageIndex  = LEVELS.findIndex(l => l.key === currentLevel.key);
  const econInfo    = ECONOMIC_LEVEL[profile?.economic_level] ?? null;
  const invInfo     = INVESTMENT_EXP[profile?.investment_experience] ?? null;
  const occInfo     = OCCUPATION[profile?.occupation] ?? null;
  const interests   = profile?.interests ?? [];
  const isOnboarded = profile?.onboarding_completed === true;

  const handleSignOut = async () => { await signOut(); navigate('/home'); };

  return (
    <div>
      {/* ── 1. 프로필 헤더 ── */}
      <div style={{
        background: 'linear-gradient(145deg,#fff,#F9FEFB)',
        border: '0.5px solid #B8EBC8', borderRadius: '12px',
        padding: '22px', display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '12px',
      }}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="프로필" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: 'none', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#52C97A,#1AAD7D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: '#fff', fontWeight: '700', border: '3px solid #fff', boxShadow: 'none', flexShrink: 0 }}>
            {(profile?.nickname || user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#2A7A4B', letterSpacing: '-0.6px', marginBottom: '2px' }}>
            {profile?.nickname || user.email || '사용자'}
          </h2>
          <p style={{ fontSize: '13px', color: '#888780', fontWeight: '500', marginBottom: '8px' }}>
            {currentLevel.emoji} {currentLevel.label} 단계 · {xp} XP · {PROVIDER_LABEL[provider] ?? provider} 로그인
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '5px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg,#52C97A,#1AAD7D)', width: `${progressPercent}%`, transition: 'width 0.6s' }} />
            </div>
            {nextLevel && <span style={{ fontSize: '11px', color: '#888780', fontWeight: '600', whiteSpace: 'nowrap' }}>{nextLevel.emoji} {xpNeeded} XP</span>}
          </div>
        </div>
      </div>

      {/* ── 2. 성장 단계 ── */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #B8EBC8', padding: '20px', marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.8px', marginBottom: '14px' }}>성장 단계</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px' }}>{currentLevel.emoji}</span>
          <div>
            <p style={{ fontSize: '17px', fontWeight: '900', color: '#2A7A4B', letterSpacing: '-0.5px' }}>{currentLevel.label} 단계</p>
            <p style={{ fontSize: '13px', color: '#888780', fontWeight: '500' }}>
              {xp} XP 획득 {nextLevel ? `· ${nextLevel.label}까지 ${xpNeeded} XP 남음` : '· 🏆 최고 단계 달성!'}
            </p>
          </div>
        </div>
        <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg,#52C97A,#1AAD7D)', width: `${progressPercent}%`, transition: 'width 0.6s' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {LEVELS.map((l, i) => {
            const isCurrent = l.key === currentLevel.key;
            const isPast    = i < stageIndex;
            return (
              <div key={l.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div title={l.label} style={{ width: isCurrent ? '28px' : '21px', height: isCurrent ? '28px' : '21px', borderRadius: '50%', flexShrink: 0, background: isCurrent ? '#52C97A' : isPast ? '#DCF5EB' : '#F2FBF5', border: isCurrent ? '2px solid #fff' : isPast ? '0.5px solid #B8EBC8' : '0.5px solid #B8EBC8', boxShadow: isCurrent ? '0 0 0 3px rgba(33,197,142,0.2)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isCurrent ? '14px' : '10px' }}>
                  {l.emoji}
                </div>
                {i < LEVELS.length - 1 && <div style={{ flex: 1, height: '2px', margin: '0 2px', background: isPast ? '#52C97A' : '#E2E8F0', borderRadius: '2px' }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: '600' }}>{LEVELS[0].label}</span>
          <span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: '600' }}>{LEVELS[LEVELS.length - 1].label}</span>
        </div>
      </div>

      {/* ── 3. 경제 프로필 ── */}
      {isOnboarded ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid #B8EBC8', padding: '20px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.8px' }}>경제 프로필</p>
            <button
              onClick={() => navigate('/onboarding')}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888780', cursor: 'pointer', fontWeight: '600', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#52C97A'}
              onMouseLeave={e => e.currentTarget.style.color = '#888780'}
            >
              ✏️ 수정
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {econInfo && (
              <div style={{ background: econInfo.bg, border: `1.5px solid ${econInfo.border}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{econInfo.emoji}</span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', marginBottom: '1px', letterSpacing: '0.4px' }}>경제 수준</p>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: econInfo.color }}>{econInfo.label} <span style={{ fontSize: '12px', color: '#888780', fontWeight: '500' }}>— {econInfo.desc}</span></p>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {invInfo && (
                <div style={{ background: '#F2FBF5', border: '0.5px solid #B8EBC8', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{invInfo.emoji}</span>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#888780', marginBottom: '1px', letterSpacing: '0.4px' }}>투자 경험</p>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#2A7A4B' }}>{invInfo.label}</p>
                  </div>
                </div>
              )}
              {occInfo && (
                <div style={{ background: '#F2FBF5', border: '0.5px solid #B8EBC8', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{occInfo.emoji}</span>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#888780', marginBottom: '1px', letterSpacing: '0.4px' }}>현재 상황</p>
                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#2A7A4B' }}>{occInfo.label}</p>
                  </div>
                </div>
              )}
            </div>
            {interests.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.6px', marginBottom: '8px' }}>관심 분야</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {interests.map(tag => (
                    <span key={tag} style={{ fontSize: '12px', fontWeight: '700', color: '#52C97A', background: '#F2FBF5', border: '0.5px solid #B8EBC8', borderRadius: '100px', padding: '4px 12px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px dashed #B8EBC8', padding: '28px', textAlign: 'center', marginBottom: '12px' }}>
          <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontSize: '15px', fontWeight: '800', color: '#2A7A4B', marginBottom: '5px' }}>경제 성장 진단을 완료해보세요</p>
          <p style={{ fontSize: '13px', color: '#888780', lineHeight: '1.6', marginBottom: '16px' }}>온보딩을 완료하면 노밍이 맞춤 코칭을 시작해요.</p>
          <button onClick={() => navigate('/onboarding')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#52C97A,#1AAD7D)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(33,197,142,0.3)' }}>
            온보딩 시작하기 →
          </button>
        </div>
      )}

      {/* ── 4. 노밍 분석 ── */}
      {isOnboarded && (
        <div style={{ background: '#FFF4D6', border: '0.5px solid #FAC775', borderRadius: '12px', padding: '18px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={`${BASE_URL}noming.png`} alt="노밍" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '11px', height: '11px', borderRadius: '50%', background: '#52C97A', border: '2px solid #FFFBEA' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '4px', letterSpacing: '0.3px' }}>노밍의 한 줄 분석</p>
            <p style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.7', fontWeight: '500' }}>{generateAnalysis(profile)}</p>
            <button onClick={() => navigate('/coach')} style={{ marginTop: '10px', padding: '7px 14px', borderRadius: '100px', background: '#52C97A', color: '#fff', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33,197,142,0.3)' }}>
              노밍에게 더 물어보기 →
            </button>
          </div>
        </div>
      )}

      {/* ── 개발자 정보 / 로그아웃 ── */}
      <DevInfo user={user} profile={profile} provider={provider} />
      <button
        onClick={handleSignOut}
        style={{ width: '100%', padding: '13px', borderRadius: '12px', background: '#F2FBF5', color: '#712B13', border: '0.5px solid #B8EBC8', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
      >
        로그아웃
      </button>
    </div>
  );
}

/* ── 출처 뱃지 맵 ─────────────────────────────────────────── */
const SOURCE_STYLE = {
  economic_bite: { label: '경제 한잎', icon: '🍃', bg: '#F0FDF4', color: '#15803D', border: '#86EFAC' },
  coach:         { label: '노밍 대화', icon: '💬', bg: '#FFFBEA', color: '#92400E', border: '#FDE68A' },
  news:          { label: '경제 읽기', icon: '📰', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
};

/* ── 용어 카드 (새 스키마) ────────────────────────────────── */
function TermCard({ term, onDelete, deleting }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const src = SOURCE_STYLE[term.sourceType] ?? { label: '기타', icon: '📖', bg: '#F8FAFC', color: '#888780', border: '#E2E8F0' };

  return (
    <div style={{
      background: '#fff', border: '0.5px solid #B8EBC8',
      borderRadius: '12px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* 용어명 + 출처 뱃지 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <p style={{ fontSize: '15px', fontWeight: '800', color: '#2A7A4B', letterSpacing: '-0.4px', lineHeight: 1.3 }}>
          {term.term}
        </p>
        <span style={{
          fontSize: '10px', fontWeight: '700', flexShrink: 0,
          background: src.bg, color: src.color, border: `1px solid ${src.border}`,
          borderRadius: '100px', padding: '2px 8px', lineHeight: 1.8,
        }}>
          {src.icon} {src.label}
        </span>
      </div>

      {/* 뜻 */}
      {term.meaning && (
        <p style={{ fontSize: '12px', color: '#5F5E5A', lineHeight: '1.65' }}>
          {term.meaning.length > 90 ? term.meaning.slice(0, 90) + '…' : term.meaning}
        </p>
      )}

      {/* 저장일 + 삭제 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '500' }}>{term.savedAt}</span>
        {confirmDel ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setConfirmDel(false)}
              style={{ padding: '4px 10px', borderRadius: '7px', background: '#F8FAFC', border: '0.5px solid #B8EBC8', fontSize: '11px', fontWeight: '600', color: '#888780', cursor: 'pointer' }}
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
            style={{ padding: '4px 10px', borderRadius: '7px', background: 'none', border: '0.5px solid #B8EBC8', fontSize: '11px', fontWeight: '600', color: '#888780', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#B8EBC8'; e.currentTarget.style.color = '#888780'; }}
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
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="용어 검색..."
          style={{
            width: '100%', padding: '12px 16px 12px 42px', boxSizing: 'border-box',
            borderRadius: '14px', border: '0.5px solid #B8EBC8',
            fontSize: '14px', color: '#2A7A4B', background: '#fff',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#52C97A'}
          onBlur={e => e.currentTarget.style.borderColor = '#B8EBC8'}
        />
      </div>

      {!loaded ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#888780', fontSize: '13px' }}>
          불러오는 중…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '0.5px solid #B8EBC8' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <BookMarked size={32} color="#888780" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: '800', color: '#2A7A4B', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            {search ? '검색 결과가 없어요' : '아직 저장한 용어가 없어요'}
          </p>
          <p style={{ fontSize: '13px', color: '#888780', lineHeight: '1.7' }}>
            {search
              ? '다른 검색어를 시도해보세요.'
              : '경제 한잎·노밍 대화·경제 읽기에서\n용어 옆 ＋ 버튼을 눌러 저장해보세요.'}
          </p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#888780', letterSpacing: '0.4px', marginBottom: '12px' }}>
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

/* ── 로드맵 탭 ────────────────────────────────────────────── */
function RoadmapTabContent() {
  const navigate    = useNavigate();
  const { profile } = useAuth();
  const [expanded, setExpanded] = useState(null);

  const aiRoadmap   = profile?.roadmap;
  const econLevel   = profile?.economic_level;
  const recommendedStep = econLevel === 'advanced' ? 4 : econLevel === 'intermediate' ? 3 : 1;

  /* ── AI 맞춤 로드맵 ── */
  if (aiRoadmap) {
    const STEP_COLORS = ['#52C97A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    return (
      <div>
        <div style={{
          background: '#FFF4D6', border: '0.5px solid #FAC775',
          borderRadius: '14px', padding: '14px 16px', marginBottom: '20px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <img src={`${import.meta.env.BASE_URL}noming.png`} alt="노밍" style={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'cover', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '3px' }}>노밍이 만든 맞춤 로드맵</p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#78350F', lineHeight: '1.5' }}>{aiRoadmap.currentStage}</p>
            {aiRoadmap.goal && (
              <p style={{ fontSize: '12px', color: '#92400E', marginTop: '4px' }}>목표: {aiRoadmap.goal}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(aiRoadmap.steps ?? []).map((step, idx) => {
            const isExpanded = expanded === step.order;
            const isLast     = idx === (aiRoadmap.steps.length - 1);
            const color      = STEP_COLORS[idx % STEP_COLORS.length];
            return (
              <div key={step.order} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0, paddingTop: '14px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: color, border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '800', color: '#fff',
                    boxShadow: `0 0 0 4px ${color}22`,
                  }}>
                    {step.order}
                  </div>
                  {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: '#E2E8F0', margin: '6px 0' }} />}
                </div>

                <div
                  style={{
                    flex: 1, marginBottom: isLast ? '0' : '8px',
                    background: '#fff', border: `0.5px solid ${color}40`,
                    borderRadius: '12px', padding: '14px 16px',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                  onClick={() => setExpanded(isExpanded ? null : step.order)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '800', color: '#2A7A4B', letterSpacing: '-0.3px', marginBottom: '2px' }}>
                        Step {step.order}. {step.title}
                      </p>
                      {step.estimatedDays && (
                        <p style={{ fontSize: '11px', color: '#888780', fontWeight: '500' }}>예상 기간: {step.estimatedDays}일</p>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.75', marginBottom: '12px' }}>
                        {step.description}
                      </p>
                      {step.topics?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                          {step.topics.map(topic => (
                            <span key={topic} style={{
                              fontSize: '12px', fontWeight: '600',
                              color, background: color + '12',
                              border: `1px solid ${color}28`,
                              borderRadius: '100px', padding: '3px 10px',
                            }}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/coach', { state: { question: `${step.title}에 대해 더 자세히 알려줘` } }); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 12px',
                          background: '#F2FBF5', border: '0.5px solid #B8EBC8',
                          borderRadius: '10px', fontSize: '12px', color: '#5F5E5A',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#52C97A'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#B8EBC8'}
                      >
                        💬 {step.title}에 대해 노밍에게 물어보기 →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── 기본 정적 로드맵 (AI 로드맵 미생성 시) ── */
  return (
    <div>

      {/* 노밍 추천 배너 */}
      {econLevel && (
        <div style={{
          background: '#FFF4D6',
          border: '0.5px solid #FAC775', borderRadius: '14px',
          padding: '12px 16px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <img src={`${import.meta.env.BASE_URL}noming.png`} alt="노밍" style={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#78350F', lineHeight: '1.6' }}>
            노밍 추천 — Step {recommendedStep}부터 시작해봐요!
          </p>
        </div>
      )}

      {/* 타임라인 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {roadmap.map((step, idx) => {
          const isExpanded    = expanded === step.step;
          const isRecommended = step.step === recommendedStep;
          const isLast        = idx === roadmap.length - 1;

          return (
            <div key={step.step} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0, paddingTop: '14px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: isRecommended ? step.color : '#F1F5F9',
                  border: `2px solid ${isRecommended ? step.color : '#E2E8F0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                  boxShadow: isRecommended ? `0 0 0 4px ${step.color}22` : 'none',
                }}>
                  {step.emoji}
                </div>
                {!isLast && (
                  <div style={{ width: '2px', flex: 1, minHeight: '20px', background: '#E2E8F0', margin: '6px 0' }} />
                )}
              </div>

              <div
                style={{
                  flex: 1, marginBottom: isLast ? '0' : '8px',
                  background: '#fff',
                  border: `0.5px solid ${isRecommended ? step.color + '50' : '#B8EBC8'}`,
                  borderRadius: '12px', padding: '14px 16px',
                  cursor: 'pointer', transition: 'border-color 0.15s',
                }}
                onClick={() => setExpanded(isExpanded ? null : step.step)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    {isRecommended && (
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        color: step.color, background: step.color + '18',
                        borderRadius: '100px', padding: '2px 9px',
                        marginBottom: '5px', display: 'inline-block',
                      }}>
                        ✨ 추천 시작점
                      </span>
                    )}
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#2A7A4B', letterSpacing: '-0.3px', marginBottom: '2px' }}>
                      Step {step.step}. {step.title}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888780', fontWeight: '500' }}>{step.duration}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#5F5E5A', lineHeight: '1.75', marginBottom: '12px' }}>
                      {step.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {step.topics.map(topic => (
                        <span key={topic} style={{
                          fontSize: '12px', fontWeight: '600',
                          color: step.color,
                          background: step.color + '12',
                          border: `1px solid ${step.color}28`,
                          borderRadius: '100px', padding: '3px 10px',
                        }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div style={{ background: '#F2FBF5', borderRadius: '12px', padding: '12px' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#888780', letterSpacing: '0.4px', marginBottom: '8px' }}>
                        💬 노밍에게 물어봐요
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {step.coachQuestions.map(q => (
                          <button
                            key={q}
                            onClick={e => { e.stopPropagation(); navigate('/coach'); }}
                            style={{
                              textAlign: 'left', padding: '9px 12px',
                              background: '#fff', border: '0.5px solid #B8EBC8',
                              borderRadius: '10px', fontSize: '12px', color: '#5F5E5A',
                              cursor: 'pointer', fontFamily: 'inherit', lineHeight: '1.55',
                              transition: 'border-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#52C97A'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#B8EBC8'}
                          >
                            {q} →
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 탭 카드 설정 ─────────────────────────────────────────── */
const TAB_CARDS = [
  { key: 'summary',    label: '요약',    Icon: LayoutDashboard },
  { key: 'diary',      label: '경제일기', Icon: BookOpen },
  { key: 'dictionary', label: '경제사전', Icon: BookMarked },
  { key: 'roadmap',    label: '로드맵',  Icon: Map },
];

/* ── 메인 ─────────────────────────────────────────────────── */
export default function MyGrowthHubPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  if (!user) {
    return (
      <PageWrapper>
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ color: '#888780', marginBottom: '16px' }}>로그인이 필요해요.</p>
          <button onClick={() => navigate('/login')} style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#52C97A,#1AAD7D)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            로그인하기
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ background: '#F2FBF5', minHeight: 'calc(100vh - 64px)' }}>

        {/* 탭 카드 + 콘텐츠 */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px 20px 80px' }}>

          {/* 카드 그리드 */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px', marginBottom: '16px',
          }}>
            {TAB_CARDS.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    borderRadius: '12px', padding: '14px 12px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '8px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: isActive ? 'none' : '0.5px solid #B8EBC8',
                    background: isActive ? '#52C97A' : '#fff',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#F2FBF5',
                  }}>
                    <Icon size={22} color={isActive ? '#fff' : '#3A9A5C'} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#fff' : '#2A7A4B',
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'summary'    && <SummaryTab />}
          {activeTab === 'diary'      && <DiaryContent />}
          {activeTab === 'dictionary' && <DictionaryTabContent />}
          {activeTab === 'roadmap'    && <RoadmapTabContent />}
        </div>

      </div>
    </PageWrapper>
  );
}
