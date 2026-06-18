import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import economicBites from '../data/economicBites';
import { getTodaysBite } from '../services/biteService';
import { useUserLevel } from '../hooks/useUserLevel';
import PageWrapper from '../components/layout/PageWrapper';

const CATEGORIES = ['전체', '기초', '금리', '투자', '저축', '거시경제', '부동산'];

const CATEGORY_COLOR = {
  '금리':     { badge: '#FEF3C7', badgeText: '#92400E' },
  '투자':     { badge: '#D1FAE5', badgeText: '#065F46' },
  '거시경제': { badge: '#DBEAFE', badgeText: '#1E40AF' },
  '저축':     { badge: '#D1FAE5', badgeText: '#14532D' },
  '부동산':   { badge: '#FCE7F3', badgeText: '#831843' },
  '기초':     { badge: '#EDE9FE', badgeText: '#4C1D95' },
};

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '심화' };
const DIFFICULTY_COLOR = { easy: '#059669', medium: '#B45309', hard: '#7C3AED' };

const LEVEL_DIFFICULTY_MAP = {
  beginner:     ['easy'],
  elementary:   ['easy', 'medium'],
  intermediate: ['medium'],
  advanced:     ['medium', 'hard'],
  expert:       ['hard'],
};

function BiteCard({ bite, isToday, isRecommended, navigate }) {
  const [hov, setHov] = useState(false);
  const cat = CATEGORY_COLOR[bite.category] ?? { badge: '#F1F5F9', badgeText: '#374151' };

  return (
    <div
      onClick={() => navigate(`/bite/${bite.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isToday ? '#F2FBF5' : '#fff',
        border: `0.5px solid ${hov ? '#52C97A' : (isToday ? '#52C97A' : '#B8EBC8')}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        position: 'relative',
      }}
    >
      {isToday && (
        <div style={{
          position: 'absolute', top: 12, right: 14,
          background: '#52C97A', color: '#fff',
          fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 100,
        }}>
          오늘
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: cat.badge, color: cat.badgeText,
          borderRadius: 100, padding: '2px 9px',
        }}>
          {bite.category}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: DIFFICULTY_COLOR[bite.difficulty] ?? '#94A3B8',
        }}>
          {DIFFICULTY_LABEL[bite.difficulty]}
        </span>
        {isRecommended && (
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 20,
            background: '#E3F9EC', color: '#2A7A4B',
            border: '0.5px solid #B8EBC8', fontWeight: 600,
          }}>
            ✓ 내 수준
          </span>
        )}
      </div>

      <div style={{
        fontSize: 15, fontWeight: 700, color: '#0F172A',
        letterSpacing: '-0.4px', marginBottom: 6,
      }}>
        {bite.title}
      </div>

      <p style={{
        fontSize: 13, color: '#64748B', lineHeight: 1.6,
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
  const todaysBite = getTodaysBite();
  const { userLevel } = useUserLevel();
  const recommendedDifficulties = LEVEL_DIFFICULTY_MAP[userLevel] ?? ['easy'];

  const filtered = selectedCategory === '전체'
    ? economicBites
    : economicBites.filter(b => b.category === selectedCategory);

  return (
    <PageWrapper>
      <div style={{ background: '#F2FBF5', minHeight: 'calc(100vh - 64px)', padding: '20px 0 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>

          {/* ── 오늘의 한잎 배너 ── */}
          <div
            onClick={() => navigate(`/bite/${todaysBite.id}`)}
            style={{
              background: '#E3F9EC',
              border: '0.5px solid #52C97A',
              borderRadius: 12,
              padding: '16px 18px',
              marginBottom: 20,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#D0F5E2'}
            onMouseLeave={e => e.currentTarget.style.background = '#E3F9EC'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3A9A5C', marginBottom: 4 }}>
                오늘의 경제 한잎
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#2A7A4B', letterSpacing: '-0.4px', marginBottom: 2 }}>
                {todaysBite.title}
              </div>
              <div style={{ fontSize: 12, color: '#52C97A', fontWeight: 400 }}>
                {todaysBite.summary.length > 40 ? todaysBite.summary.slice(0, 40) + '...' : todaysBite.summary}
              </div>
            </div>
            <div style={{
              width: 36, height: 36, background: '#fff',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Leaf size={18} color="#52C97A" />
            </div>
          </div>

          {/* ── 카테고리 필터 ── */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px', borderRadius: 100,
                  background: selectedCategory === cat ? '#52C97A' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748B',
                  border: `0.5px solid ${selectedCategory === cat ? '#52C97A' : '#B8EBC8'}`,
                  fontSize: 12, fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {cat} {cat !== '전체' && `(${economicBites.filter(b => b.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* ── 개수 ── */}
          <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginBottom: 12 }}>
            {filtered.length}개의 경제 한잎
          </p>

          {/* ── 카드 목록 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(bite => (
              <BiteCard
                key={bite.id}
                bite={bite}
                isToday={bite.id === todaysBite.id}
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
