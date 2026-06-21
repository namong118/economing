import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import economicBites from '../data/economicBites';
import { getTodaysBite, getRecommendedBite } from '../services/biteService';
import { useUserLevel } from '../hooks/useUserLevel';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';

const CATEGORIES = ['전체', '기초', '금리', '투자', '저축', '거시경제', '부동산', '지표읽기', '실생활경제'];

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '심화' };

const LEVEL_DIFFICULTY_MAP = {
  beginner:     ['easy'],
  elementary:   ['easy', 'medium'],
  intermediate: ['medium'],
  advanced:     ['medium', 'hard'],
  expert:       ['hard'],
};

function BiteCard({ bite, isToday, isRecommended, navigate }) {
  const [hov, setHov] = useState(false);
  const isEasy = bite.difficulty === 'easy';

  return (
    <div
      onClick={() => navigate(`/bite/${bite.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--c-surface)',
        border: `1px solid ${hov || isToday ? 'var(--c-green-500)' : 'var(--c-line)'}`,
        borderRadius: 14,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        position: 'relative',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {isToday && (
        <div style={{
          position: 'absolute', top: 12, right: 14,
          background: 'var(--c-green-500)', color: '#fff',
          fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 100,
        }}>
          오늘
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {/* 카테고리 뱃지 — 색 분기 없이 통일 */}
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: 'var(--c-green-50)', color: 'var(--c-forest-700)',
          borderRadius: 'var(--r-full)', padding: '2px 9px',
        }}>
          {bite.category}
        </span>
        {/* 난이도 뱃지 — 쉬움만 살짝 강조, 나머지 중립 */}
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: isEasy ? 'var(--c-green-100)' : 'var(--c-line-soft)',
          color: isEasy ? 'var(--c-forest-700)' : 'var(--c-slate)',
          borderRadius: 'var(--r-full)', padding: '2px 9px',
        }}>
          {DIFFICULTY_LABEL[bite.difficulty]}
        </span>
        {isRecommended && (
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 'var(--r-full)',
            background: 'var(--c-green-100)', color: 'var(--c-forest-700)',
            fontWeight: 700,
          }}>
            ✓ 내 수준
          </span>
        )}
      </div>

      <div style={{
        fontSize: 15, fontWeight: 700, color: 'var(--c-ink)',
        letterSpacing: '-0.4px', marginBottom: 6,
      }}>
        {bite.title}
      </div>

      <p style={{
        fontSize: 13, color: 'var(--c-slate)', lineHeight: 1.6,
        fontWeight: 400,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {bite.summary}
      </p>
    </div>
  );
}

export default function EconomicBiteArchivePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [todaysBite, setTodaysBite] = useState(null);
  const { user } = useAuth();
  const { userLevel } = useUserLevel();
  const recommendedDifficulties = LEVEL_DIFFICULTY_MAP[userLevel] ?? ['easy'];

  useEffect(() => {
    if (user?.id) {
      getRecommendedBite(user.id, userLevel).then(setTodaysBite).catch(() => setTodaysBite(getTodaysBite()));
    } else {
      setTodaysBite(getTodaysBite());
    }
  }, [user?.id, userLevel]); // eslint-disable-line

  const filtered = selectedCategory === '전체'
    ? economicBites
    : economicBites.filter(b => b.category === selectedCategory);

  return (
    <PageWrapper>
      <div style={{ background: 'var(--c-canvas)', minHeight: 'calc(100vh - 64px)', padding: '20px 0 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>

          {/* ── 오늘의 한잎 다크 히어로 배너 ── */}
          <div
            onClick={() => todaysBite && navigate(`/bite/${todaysBite.id}`)}
            style={{
              background: 'linear-gradient(145deg, #0F6B52 0%, #06352B 100%)',
              borderRadius: 18, padding: '20px', marginBottom: 20,
              cursor: todaysBite ? 'pointer' : 'default',
              boxShadow: '0 4px 24px rgba(6,53,43,0.28)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 30, bottom: -30, width: 70, height: 70, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

            {todaysBite ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                      <Leaf size={11} color="rgba(255,255,255,0.65)" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.3px' }}>
                        오늘의 추천 한잎
                      </span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', marginBottom: 6, lineHeight: 1.35 }}>
                      {todaysBite.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 400, lineHeight: 1.55 }}>
                      {todaysBite.summary.length > 52 ? todaysBite.summary.slice(0, 52) + '...' : todaysBite.summary}
                    </div>
                  </div>
                  <div style={{ width: 40, height: 40, flexShrink: 0, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Leaf size={18} color="rgba(255,255,255,0.9)" />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '4px 12px' }}>
                    읽으러 가기 →
                  </span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ height: 11, width: 100, borderRadius: 6, background: 'rgba(255,255,255,0.15)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />
                <div style={{ height: 20, width: '70%', borderRadius: 6, background: 'rgba(255,255,255,0.15)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />
                <div style={{ height: 14, width: '55%', borderRadius: 6, background: 'rgba(255,255,255,0.1)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />
              </div>
            )}
          </div>

          {/* ── 카테고리 필터 ── */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              const count = cat !== '전체' ? economicBites.filter(b => b.category === cat).length : null;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 12px', borderRadius: 'var(--r-full)',
                    background: isActive ? 'var(--c-green-500)' : 'var(--c-surface)',
                    color: isActive ? '#fff' : 'var(--c-slate)',
                    border: `1px solid ${isActive ? 'var(--c-green-500)' : 'var(--c-line)'}`,
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}
                >
                  {cat}
                  {count !== null && (
                    <span style={{ color: isActive ? 'rgba(255,255,255,0.75)' : 'var(--c-muted)', fontWeight: 500 }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── 개수 ── */}
          <p style={{ fontSize: 11, color: 'var(--c-muted)', fontWeight: 500, marginBottom: 12 }}>
            {filtered.length}개의 경제 한잎
          </p>

          {/* ── 카드 목록 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(bite => (
              <BiteCard
                key={bite.id}
                bite={bite}
                isToday={todaysBite && bite.id === todaysBite.id}
                isRecommended={recommendedDifficulties.includes(bite.difficulty)}
                navigate={navigate}
              />
            ))}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
