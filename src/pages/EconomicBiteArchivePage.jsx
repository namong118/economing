import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import economicBites from '../data/economicBites';
import { getTodaysBite } from '../services/biteService';
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

function BiteCard({ bite, isToday, navigate }) {
  const [hov, setHov] = useState(false);
  const cat = CATEGORY_COLOR[bite.category] ?? { badge: '#F1F5F9', badgeText: '#374151' };

  return (
    <div
      onClick={() => navigate(`/bite/${bite.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isToday ? 'linear-gradient(145deg, #F0FDF4, #DCFCE7)' : '#fff',
        border: `1.5px solid ${isToday ? '#6EE7B7' : (hov ? '#A7F3D0' : '#E8FAF3')}`,
        borderRadius: '18px', padding: '18px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 6px 20px rgba(33,197,142,0.12)' : 'none',
        position: 'relative',
      }}
    >
      {isToday && (
        <div style={{
          position: 'absolute', top: '12px', right: '14px',
          background: '#21C58E', color: '#fff',
          fontSize: '10px', fontWeight: '800', letterSpacing: '0.3px',
          padding: '3px 8px', borderRadius: '100px',
        }}>
          오늘
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{
          fontSize: '11px', fontWeight: '700',
          background: cat.badge, color: cat.badgeText,
          borderRadius: '100px', padding: '2px 9px',
        }}>
          {bite.category}
        </span>
        <span style={{
          fontSize: '11px', fontWeight: '600',
          color: DIFFICULTY_COLOR[bite.difficulty] ?? '#94A3B8',
        }}>
          {DIFFICULTY_LABEL[bite.difficulty]}
        </span>
      </div>

      <div style={{
        fontSize: '17px', fontWeight: '900', color: '#0F172A',
        letterSpacing: '-0.6px', marginBottom: '7px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#21C58E', display: 'inline-block', flexShrink: 0,
        }}/>
        {bite.title}
      </div>

      <p style={{
        fontSize: '13px', color: '#64748B', lineHeight: '1.6',
        letterSpacing: '-0.15px', fontWeight: '500',
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

  const filtered = selectedCategory === '전체'
    ? economicBites
    : economicBites.filter(b => b.category === selectedCategory);

  return (
    <PageWrapper>
      <div style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', padding: '28px 0 72px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>

          {/* ── 헤더 ── */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700', color: '#94A3B8',
                padding: '0', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              ← 돌아가기
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '22px' }}>🍃</span>
              <h1 style={{
                fontSize: '24px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px',
              }}>
                경제 한잎 모음
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', fontWeight: '500', letterSpacing: '-0.2px' }}>
              총 {economicBites.length}개의 경제 개념을 쉽게 배워봐요.
            </p>
          </div>

          {/* ── 오늘의 한잎 배너 ── */}
          <div
            onClick={() => navigate(`/bite/${todaysBite.id}`)}
            style={{
              background: 'linear-gradient(135deg, #21C58E, #16A374)',
              borderRadius: '20px', padding: '18px 22px',
              marginBottom: '24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 6px 24px rgba(33,197,142,0.25)',
              transition: 'all 0.15s',
            }}
          >
            <div>
              <div style={{
                fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.5px', marginBottom: '5px',
              }}>
                오늘의 경제 한잎
              </div>
              <div style={{
                fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-0.7px',
              }}>
                {todaysBite.title}
              </div>
              <div style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '4px', fontWeight: '500',
              }}>
                {todaysBite.summary.length > 40 ? todaysBite.summary.slice(0, 40) + '...' : todaysBite.summary}
              </div>
            </div>
            <div style={{
              width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <BookMarked size={22} color="#fff" />
            </div>
          </div>

          {/* ── 카테고리 필터 ── */}
          <div style={{
            display: 'flex', gap: '7px', flexWrap: 'wrap',
            marginBottom: '20px',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '100px',
                  background: selectedCategory === cat ? '#21C58E' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748B',
                  border: `1.5px solid ${selectedCategory === cat ? '#21C58E' : '#E2E8F0'}`,
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  letterSpacing: '-0.2px', transition: 'all 0.15s',
                }}
              >
                {cat} {cat !== '전체' && `(${economicBites.filter(b => b.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* ── 개수 ── */}
          <p style={{
            fontSize: '12px', color: '#94A3B8', fontWeight: '600',
            marginBottom: '14px', letterSpacing: '-0.1px',
          }}>
            {filtered.length}개의 경제 한잎
          </p>

          {/* ── 카드 그리드 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(bite => (
              <BiteCard
                key={bite.id}
                bite={bite}
                isToday={bite.id === todaysBite.id}
                navigate={navigate}
              />
            ))}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
