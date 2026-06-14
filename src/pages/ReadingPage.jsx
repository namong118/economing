import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CONTENTS, CATEGORY_STYLE, getTodayContent, getOtherContents, markAsRead } from '../services/readingService';
import PageWrapper from '../components/layout/PageWrapper';
import SaveTermButton from '../components/common/SaveTermButton';

/* ── 카테고리 배지 ────────────────────────────────────────── */
function CategoryBadge({ category }) {
  const s = CATEGORY_STYLE[category] ?? { color: '#888780', bg: '#F1F5F9', border: '#E2E8F0' };
  return (
    <span style={{
      fontSize: '11px', fontWeight: '700',
      color: s.color, background: s.bg, border: `1.5px solid ${s.border}`,
      borderRadius: '100px', padding: '3px 10px', letterSpacing: '0.3px',
    }}>
      {category}
    </span>
  );
}

/* ── 읽기 완료 버튼 ──────────────────────────────────────── */
function CompleteButton({ contentId, userId, navigate, onComplete }) {
  const [state, setState] = useState('idle'); // idle | loading | done

  const handleClick = async () => {
    if (state !== 'idle') return;
    setState('loading');
    const result = await markAsRead(userId, contentId);
    setState('done');
    if (onComplete) onComplete(result);
  };

  if (state === 'done') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        padding: '16px', borderRadius: '12px',
        background: '#F4FAF6',
        border: '0.5px solid #d4ede3',
      }}>
        <span style={{ fontSize: '22px' }}>🌱</span>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '800', color: '#166534', letterSpacing: '-0.4px' }}>
            읽기 완료! {userId ? '+5 XP 획득' : ''}
          </p>
          {!userId && (
            <p style={{ fontSize: '12px', color: '#16A34A', marginTop: '2px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{ background: 'none', border: 'none', color: '#21C58E', fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '12px' }}
              >
                로그인
              </button>
              {' '}하면 XP를 적립할 수 있어요.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      style={{
        width: '100%', padding: '16px', borderRadius: '12px',
        background: state === 'loading'
          ? '#A7F3D0'
          : 'linear-gradient(135deg, #21C58E, #1AAD7D)',
        color: '#fff', border: 'none',
        fontSize: '16px', fontWeight: '800',
        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        letterSpacing: '-0.4px',
        boxShadow: state === 'loading' ? 'none' : '0 6px 20px rgba(33,197,142,0.35)',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}
    >
      {state === 'loading' ? (
        <>
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '16px' }}>⏳</span>
          잠깐만요...
        </>
      ) : (
        <>
          ✅ 읽기 완료 {userId ? '(+5 XP)' : ''}
        </>
      )}
    </button>
  );
}

/* ── 메인 아티클 카드 ─────────────────────────────────────── */
function ArticleCard({ content, userId, navigate, isToday = false, defaultOpen = false }) {
  const [open, setOpen]     = useState(defaultOpen);
  const [done, setDone]     = useState(false);
  const BASE_URL = import.meta.env.BASE_URL;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: done
        ? '0.5px solid #d4ede3'
        : isToday
          ? '0.5px solid #d4ede3'
          : '0.5px solid #d4ede3',
      overflow: 'hidden',
      marginBottom: isToday ? '0' : '10px',
      transition: 'border-color 0.3s',
    }}>
      {/* 카드 헤더 */}
      <button
        onClick={() => !isToday && setOpen(v => !v)}
        style={{
          width: '100%', padding: '20px 22px',
          background: done ? '#F4FAF6' : 'transparent',
          border: 'none', cursor: isToday ? 'default' : 'pointer',
          textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px',
          transition: 'background 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <CategoryBadge category={content.category} />
            <span style={{ fontSize: '11px', color: '#888780', fontWeight: '600' }}>
              📖 {content.readingTime}분 읽기
            </span>
            {done && (
              <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700' }}>
                ✅ 완료
              </span>
            )}
          </div>
          {!isToday && (
            <span style={{ fontSize: '14px', color: '#CBD5E1', flexShrink: 0 }}>
              {open ? '▲' : '▼'}
            </span>
          )}
        </div>
        <h2 style={{
          fontSize: isToday ? '20px' : '16px',
          fontWeight: '900', color: '#085041',
          letterSpacing: '-0.6px', lineHeight: '1.35', margin: 0,
        }}>
          {content.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#888780', lineHeight: '1.6', margin: 0 }}>
          {content.intro}
        </p>
      </button>

      {/* 본문 (오늘 카드는 항상 열림, 다른 카드는 토글) */}
      {(isToday || open) && (
        <div style={{ padding: '0 22px 24px' }}>

          {/* 구분선 */}
          <div style={{ height: '1px', background: '#F1F5F9', marginBottom: '20px' }} />

          {/* 본문 단락 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {content.paragraphs.map((para, i) => (
              <p key={i} style={{
                fontSize: '15px', color: '#5F5E5A', lineHeight: '1.8',
                letterSpacing: '-0.2px', margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* 핵심 포인트 */}
          <div style={{
            background: '#F4FAF6',
            border: '0.5px solid #d4ede3',
            borderRadius: '12px', padding: '18px 20px', marginBottom: '14px',
          }}>
            <p style={{ fontSize: '13px', fontWeight: '800', color: '#166534', marginBottom: '12px', letterSpacing: '0.2px' }}>
              📌 핵심 포인트
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {content.summary.map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: '#21C58E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: '#fff', fontWeight: '800', marginTop: '1px',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 핵심 용어 */}
          <div style={{
            background: '#F4FAF6', border: '0.5px solid #d4ede3',
            borderRadius: '12px', padding: '18px 20px', marginBottom: '14px',
          }}>
            <p style={{ fontSize: '13px', fontWeight: '800', color: '#085041', marginBottom: '12px', letterSpacing: '0.2px' }}>
              📚 핵심 용어
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {content.keywords.map((kw, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: '800', color: '#21C58E',
                    background: '#F4FAF6', border: '0.5px solid #d4ede3',
                    borderRadius: '100px', padding: '3px 10px',
                    flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                    {kw.term}
                  </span>
                  <p style={{ fontSize: '13px', color: '#888780', lineHeight: '1.5', margin: 0, fontWeight: '500', flex: 1 }}>
                    {kw.desc}
                  </p>
                  <SaveTermButton
                    term={kw.term}
                    meaning={kw.desc}
                    sourceType="news"
                    sourceId={content.id}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 노밍 한마디 */}
          <div style={{
            background: '#FFF4D6',
            border: '0.5px solid #FAC775',
            borderRadius: '12px', padding: '16px 18px', marginBottom: '20px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={`${BASE_URL}coach.png`}
                alt="노밍"
                style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '11px', height: '11px', borderRadius: '50%',
                background: '#21C58E', border: '2px solid #FFFBEA',
              }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', marginBottom: '4px', letterSpacing: '0.3px' }}>
                ☀️ 노밍 한마디
              </p>
              <p style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.7', fontWeight: '500' }}>
                {content.nomingComment}
              </p>
            </div>
          </div>

          {/* 읽기 완료 버튼 */}
          {!done && (
            <CompleteButton
              contentId={content.id}
              userId={userId}
              navigate={navigate}
              onComplete={() => setDone(true)}
            />
          )}
          {done && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '16px', borderRadius: '12px',
              background: '#F4FAF6',
              border: '0.5px solid #d4ede3',
            }}>
              <span style={{ fontSize: '20px' }}>🌱</span>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '800', color: '#166534', letterSpacing: '-0.4px' }}>
                  이미 읽었어요! {userId ? '+5 XP 획득' : ''}
                </p>
                {!userId && (
                  <p style={{ fontSize: '12px', color: '#16A34A', marginTop: '2px' }}>
                    <button
                      onClick={() => navigate('/login')}
                      style={{ background: 'none', border: 'none', color: '#21C58E', fontWeight: '700', cursor: 'pointer', padding: 0, fontSize: '12px' }}
                    >
                      로그인
                    </button>
                    {' '}하면 XP를 적립할 수 있어요.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 메인 페이지 ──────────────────────────────────────────── */
export default function ReadingPage() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const todayContent  = getTodayContent();
  const otherContents = getOtherContents(todayContent.id);

  return (
    <PageWrapper>
      <div style={{ background: '#F4FAF6', minHeight: 'calc(100vh - 64px)', paddingBottom: '64px' }}>

        {/* ── 히어로 헤더 ──────────────────────────────── */}
        <div style={{
          background: '#F4FAF6',
          padding: '36px 20px 28px',
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px' }}>☀️</span>
              <h1 style={{
                fontSize: '24px', fontWeight: '900', color: '#085041',
                letterSpacing: '-0.8px', margin: 0,
              }}>
                오늘의 경제 읽기
              </h1>
            </div>
            <p style={{ fontSize: '15px', color: '#888780', lineHeight: '1.7', margin: 0 }}>
              하루 3분, 경제 감각을 키워보세요.
            </p>
            {/* 진행 칩 */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {[
                { label: `총 ${CONTENTS.length}개 아티클`, icon: '📖' },
                { label: '읽기 완료 시 +5 XP', icon: '⚡' },
                { label: '매일 새 콘텐츠', icon: '🔄' },
              ].map(chip => (
                <div key={chip.label} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', fontWeight: '600', color: '#21C58E',
                  background: '#fff', border: '0.5px solid #d4ede3',
                  borderRadius: '100px', padding: '5px 12px',
                }}>
                  <span>{chip.icon}</span>
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '28px 20px 0' }}>

          {/* ── 오늘의 콘텐츠 ─────────────────────────── */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#21C58E', flexShrink: 0,
                boxShadow: '0 0 0 3px rgba(33,197,142,0.2)',
              }} />
              <p style={{ fontSize: '13px', fontWeight: '800', color: '#21C58E', letterSpacing: '0.3px' }}>
                오늘의 추천
              </p>
            </div>
            <ArticleCard
              content={todayContent}
              userId={user?.id}
              navigate={navigate}
              isToday={true}
              defaultOpen={true}
            />
          </div>

          {/* ── 더 읽어보기 ───────────────────────────── */}
          <div>
            <p style={{ fontSize: '16px', fontWeight: '800', color: '#085041', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              더 읽어보기
            </p>
            {otherContents.map(content => (
              <ArticleCard
                key={content.id}
                content={content}
                userId={user?.id}
                navigate={navigate}
                isToday={false}
                defaultOpen={false}
              />
            ))}
          </div>

          {/* ── 하단 노밍 CTA ─────────────────────────── */}
          <div style={{
            marginTop: '28px',
            background: '#FFF4D6',
            border: '0.5px solid #FAC775',
            borderRadius: '12px', padding: '20px 22px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#B45309', marginBottom: '6px' }}>
              ☀️ 더 궁금한 게 생겼나요?
            </p>
            <p style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.7', marginBottom: '14px' }}>
              노밍에게 바로 질문해봐요.
            </p>
            <button
              onClick={() => navigate('/coach')}
              style={{
                padding: '10px 22px', borderRadius: '100px',
                background: '#21C58E', color: '#fff', border: 'none',
                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(33,197,142,0.3)',
              }}
            >
              노밍에게 질문하기 →
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
