import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addXp } from '../services/profileService';
import { getNextLevelInfo } from '../data/levelData';
import { getTodaysBite } from '../services/biteService';
import PageWrapper from '../components/layout/PageWrapper';
import DailyBiteCard from '../components/home/DailyBiteCard';

/* ══ 노밍 카드 ══════════════════════════════════════════════ */
function NomingCard({ bite, profile, navigate }) {
  const userName = profile?.nickname?.split(' ')[0] || '사용자';

  const todos = [
    { title: '경제 프로필 설정하기', description: '2분이면 완료 — 맞춤 코칭 시작', icon: '👤', iconBg: '#E1F5EE', path: '/onboarding' },
    { title: '한잎 퀴즈 풀기',       description: '+5 XP 획득 가능',               icon: '⚡', iconBg: '#FFF4D6', path: `/bite/${bite.id}` },
    { title: '경제일기 쓰기',         description: '오늘 배운 것 기록하기',          icon: '📔', iconBg: '#F1EFE8', path: '/diary' },
  ];

  const questions = [
    `${bite.title}이 내 적금에 미치는 영향은?`,
    `${bite.title}이 부동산에 미치는 영향은?`,
  ];

  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '0.5px solid #d4ede3',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* 노밍 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: '#FFC83D',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          ☀️
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#085041' }}>노밍 · AI 경제 코치</div>
          <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>언제든 물어보세요</div>
        </div>
      </div>

      {/* 말풍선 */}
      <div style={{
        background: '#F4FAF6', borderRadius: '0 10px 10px 10px',
        padding: '13px 14px', fontSize: 13, color: '#444441',
        lineHeight: 1.7, border: '0.5px solid #d4ede3', marginBottom: 14,
      }}>
        {userName}님, 오늘의 주제는{' '}
        <strong style={{ color: '#085041' }}>{bite.title}</strong>이에요.<br />
        오늘 배운 내용이 내 생활에 어떤 영향이 있는지 같이 알아볼까요?
      </div>

      {/* 추천 질문 라벨 */}
      <div style={{ fontSize: 11, color: '#888780', marginBottom: 8 }}>오늘의 추천 질문</div>

      {/* 추천 질문 버튼 */}
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => navigate('/coach', { state: { question: q } })}
          style={{
            width: '100%', background: '#F4FAF6', border: '0.5px solid #d4ede3',
            borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#085041',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6, cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
          onMouseLeave={e => e.currentTarget.style.background = '#F4FAF6'}
        >
          <span style={{ flex: 1, marginRight: 8 }}>{q}</span>
          <span style={{ color: '#21C58E', flexShrink: 0 }}>→</span>
        </button>
      ))}

      <hr style={{ border: 'none', borderTop: '0.5px solid #f0f7f3', margin: '14px 0' }} />

      {/* 오늘 할 일 라벨 */}
      <div style={{ fontSize: 11, color: '#888780', marginBottom: 8 }}>오늘 해야 할 것</div>

      {/* 할 일 목록 */}
      {todos.map((todo, i) => (
        <div
          key={i}
          onClick={() => navigate(todo.path)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 0', cursor: 'pointer',
            borderBottom: i < todos.length - 1 ? '0.5px solid #f0f7f3' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FAFFFE'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: todo.iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, flexShrink: 0,
          }}>
            {todo.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#2C2C2A' }}>{todo.title}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{todo.description}</div>
          </div>
          <span style={{ color: '#C0DD97', fontSize: 13 }}>→</span>
        </div>
      ))}

      <hr style={{ border: 'none', borderTop: '0.5px solid #f0f7f3', margin: '14px 0' }} />

      {/* 직접 질문 */}
      <button
        onClick={() => navigate('/coach')}
        style={{
          width: '100%', background: '#F4FAF6', border: '0.5px solid #d4ede3',
          borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#888780',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', marginTop: 'auto',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#E8F7F1'}
        onMouseLeave={e => e.currentTarget.style.background = '#F4FAF6'}
      >
        직접 질문하기...
        <span style={{ color: '#21C58E' }}>→</span>
      </button>
    </div>
  );
}

/* ══ 메인 ════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate                          = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [xpLoading, setXpLoading]         = useState(false);

  const bite = getTodaysBite();
  const xp   = profile?.xp ?? 0;
  const { currentLevel } = getNextLevelInfo(xp);

  const d    = new Date();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const today = `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;

  const handleAddXp = async () => {
    if (!user || xpLoading) return;
    setXpLoading(true);
    await addXp(user.id, 5);
    await refreshProfile();
    setXpLoading(false);
  };

  return (
    <PageWrapper>
      <style>{`
        .hd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 8px 24px 60px;
          background: #F4FAF6;
          min-height: calc(100vh - 90px);
          box-sizing: border-box;
          align-items: stretch;
          align-content: start;
        }
        .hd-header { align-self: center; }
        .hd-bite, .hd-noming { display: flex; flex-direction: column; }
        @media (min-width: 760px) {
          .hd-grid {
            grid-template-columns: 1.2fr 1fr;
            grid-template-rows: auto 1fr;
            align-content: stretch;
          }
          .hd-header { grid-column: 1 / -1; align-self: center; }
          .hd-bite, .hd-noming { align-self: stretch; }
        }
        @media (min-width: 1160px) {
          .hd-grid {
            max-width: 1160px;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="anim-fade">
        <div className="hd-grid">

          {/* ── 헤더 ── */}
          <div className="hd-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#888780' }}>{today} ☀️</span>
            <div style={{
              background: '#E1F5EE', border: '0.5px solid #9FE1CB',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 11, color: '#085041',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              🍃 {currentLevel.label} · {xp} XP
              {user && (
                <button
                  onClick={handleAddXp}
                  disabled={xpLoading}
                  style={{ background: 'none', border: 'none', fontSize: 9, color: '#9FE1CB', cursor: 'pointer', padding: '0 0 0 4px' }}
                >
                  {xpLoading ? '…' : '+5'}
                </button>
              )}
            </div>
          </div>

          {/* ── 경제 한잎 ── */}
          <div className="hd-bite">
            <DailyBiteCard bite={bite} />
          </div>

          {/* ── 노밍 카드 ── */}
          <div className="hd-noming">
            <NomingCard bite={bite} profile={profile} navigate={navigate} />
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
