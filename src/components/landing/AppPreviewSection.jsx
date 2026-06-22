import { useState } from 'react';
import {
  Sun, Leaf, Zap, MessageCircle, NotebookPen,
  ChevronRight, BookOpen, Newspaper, Lightbulb,
} from 'lucide-react';

const SCREENS = [
  { key: 'home',   label: '홈' },
  { key: 'coach',  label: '노밍' },
  { key: 'bites',  label: '경제한잎' },
  { key: 'diary',  label: '경제일기' },
];

export default function AppPreviewSection() {
  const [active, setActive] = useState('home');

  const SCREEN_MAP = { home: HomeScreen, coach: CoachScreen, bites: BitesScreen, diary: DiaryScreen };
  const Current = SCREEN_MAP[active];

  return (
    <section style={{ background: '#fff', padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{
            display: 'inline-block',
            background: '#F0F9FF', color: '#0284C7',
            borderRadius: '100px', padding: '5px 14px',
            fontSize: '13px', fontWeight: '700',
            letterSpacing: '-0.2px', marginBottom: '16px',
          }}>
            실제 화면 미리보기
          </p>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '900', color: 'var(--c-ink)',
            letterSpacing: '-1px', lineHeight: '1.25',
          }}>
            이런 화면으로<br />공부하게 됩니다.
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {SCREENS.map(s => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              style={{
                padding: '9px 20px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: active === s.key ? '700' : '500',
                background: active === s.key ? 'var(--c-green-500)' : 'var(--c-line-soft)',
                color: active === s.key ? '#fff' : 'var(--c-slate)',
                transition: 'all 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhoneFrame>
            <Current />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ children }) {
  return (
    <div style={{
      width: '280px',
      background: '#1C1C1E',
      borderRadius: '40px',
      padding: '12px',
      boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        width: '80px', height: '24px',
        background: '#1C1C1E', borderRadius: '0 0 16px 16px',
        margin: '0 auto 4px', position: 'relative', zIndex: 1,
      }} />
      <div style={{
        background: 'var(--c-canvas)',
        borderRadius: '28px',
        height: '520px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── 공통 TopBar ─────────────────────────────────────────── */
function MockTopBar({ title }) {
  return (
    <div style={{
      background: '#fff', padding: '11px 14px 10px',
      borderBottom: '1px solid var(--c-line-soft)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '-0.3px', color: 'var(--c-green-500)' }}>ECONOMING</span>
      <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--c-ink)' }}>{title}</span>
      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--c-green-50)', border: '0.5px solid var(--c-green-100)' }} />
    </div>
  );
}

/* ── 홈 화면 ─────────────────────────────────────────────── */
function HomeScreen() {
  const todos = [
    { label: '한잎 읽기',       Icon: Leaf,          done: true },
    { label: '한잎 퀴즈',       Icon: Zap,           done: false },
    { label: '노밍과 대화',     Icon: MessageCircle, done: false },
    { label: '경제일기',        Icon: NotebookPen,   done: false },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <MockTopBar title="홈" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* XP 그리팅 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, #21C58E 0%, #0D9B6E 100%)',
          borderRadius: '14px', padding: '14px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10, width: 70, height: 70, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>6월 22일 일요일</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px' }}>민준님, 안녕하세요!</div>
            </div>
            <span style={{
              fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.9)',
              background: 'rgba(255,255,255,0.18)', borderRadius: '100px', padding: '3px 8px',
              border: '0.5px solid rgba(255,255,255,0.3)',
            }}>
              새싹 경제인
            </span>
          </div>
          {/* XP 바 */}
          <div style={{ background: 'rgba(255,255,255,0.22)', borderRadius: '99px', height: '4px', overflow: 'hidden', marginBottom: '4px' }}>
            <div style={{ width: '42%', height: '100%', background: '#fff', borderRadius: '99px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
            <span>Lv.1</span><span>다음 레벨까지 58 XP</span>
          </div>
          {/* 할일 pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {todos.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '3px 8px', borderRadius: '20px',
                background: t.done ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.18)',
                border: `0.5px solid ${t.done ? 'transparent' : 'rgba(255,255,255,0.4)'}`,
              }}>
                <t.Icon size={8} color={t.done ? 'var(--c-green-500)' : 'rgba(255,255,255,0.9)'} />
                <span style={{ fontSize: '8px', color: t.done ? 'var(--c-forest-700)' : 'rgba(255,255,255,0.9)', fontWeight: t.done ? 600 : 400 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 오늘의 경제 한잎 다크 카드 */}
        <div style={{ background: 'var(--c-surface)', borderRadius: '12px', border: '0.5px solid var(--c-line)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0F6B52 0%, #06352B 100%)',
            padding: '14px 12px 12px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -10, top: -10, width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.65)' }}>오늘의 경제 한잎</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>금리</span>
                <span style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '20px', background: 'rgba(255,196,61,0.2)', color: '#FCD34D' }}>쉬움</span>
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px', letterSpacing: '-0.4px' }}>금리란 무엇인가요?</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.72)', lineHeight: '1.55' }}>돈을 빌릴 때 내는 이용료예요. 금리가 오르면 대출이자가 늘고, 내리면 줄어들어요.</div>
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ background: 'var(--c-canvas)', borderRadius: '8px', padding: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {[['한국은행', '기준금리 설정'], ['은행', '대출·예금 금리 반영'], ['우리 생활', '이자·소비 변화']].map(([a, b], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: i === 2 ? 'var(--c-green-500)' : '#fff', border: `1px solid ${i === 2 ? 'var(--c-green-500)' : 'var(--c-line)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '8px', color: i === 2 ? '#fff' : 'var(--c-forest-700)' }}>{i + 1}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '8px', fontWeight: '700', color: 'var(--c-ink)' }}>{a}</span>
                      <span style={{ fontSize: '7px', color: 'var(--c-muted)', marginLeft: '4px' }}>{b}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #21C58E 0%, #0D9B6E 100%)', borderRadius: '7px', padding: '8px', textAlign: 'center', color: '#fff', fontSize: '9px', fontWeight: '600' }}>
              오늘의 한잎 배우기 →
            </div>
          </div>
        </div>

        {/* 노밍 한마디 */}
        <div style={{
          background: 'var(--c-yellow-100)', borderRadius: '12px',
          border: '1px solid var(--c-yellow-border)', padding: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,200,61,0.25)', border: '1.5px solid var(--c-yellow-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sun size={16} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--c-amber-700)' }}>노밍 한마디</div>
              <div style={{ fontSize: '8px', color: '#A57800', opacity: 0.8 }}>오늘의 경제 코칭</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '8px', padding: '8px 10px', fontSize: '9px', color: 'var(--c-amber-700)', lineHeight: '1.65', border: '0.5px solid var(--c-yellow-border)', marginBottom: '8px' }}>
            금리는 경제의 온도계예요. 오늘은 금리가 내 생활에 어떤 영향을 주는지 같이 알아봐요!
          </div>
          {['금리가 오르면 예금이자도 오르나요?', '지금 예금 vs 적금 뭐가 나을까요?'].map((q, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.55)', border: '0.5px solid var(--c-yellow-border)',
              borderRadius: '6px', padding: '6px 8px', fontSize: '8px', color: 'var(--c-amber-700)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '4px', fontWeight: 500,
            }}>
              <span style={{ flex: 1, marginRight: 4 }}>{q}</span>
              <span style={{ color: 'var(--c-yellow-500)', flexShrink: 0 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 노밍 화면 ───────────────────────────────────────────── */
function CoachScreen() {
  const questions = [
    '비상금은 얼마나 모아야 하나요?',
    '파킹통장과 적금 중 뭐가 더 나을까요?',
    '경제 공부 순서를 알려주세요.',
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MockTopBar title="노밍" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* 노밍 인사 카드 */}
        <div style={{
          background: 'var(--c-yellow-100)', border: '1px solid var(--c-yellow-border)',
          borderRadius: '12px', padding: '12px',
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,200,61,0.2)', border: '1.5px solid var(--c-yellow-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sun size={20} color="#F59E0B" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--c-amber-700)', marginBottom: '3px' }}>노밍이에요!</div>
              <div style={{ fontSize: '9px', color: 'var(--c-amber-700)', lineHeight: '1.55', opacity: 0.85 }}>무엇부터 시작해야 할지 모르겠다면 제가 함께 정리해드릴게요.</div>
            </div>
          </div>
        </div>

        {/* 추천 질문 */}
        <div>
          <div style={{ fontSize: '8px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.5px', marginBottom: '7px' }}>
            이런 고민이 있다면 물어보세요
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {questions.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px',
                padding: '10px 11px', borderRadius: '9px',
                background: 'var(--c-surface)', border: '1px solid var(--c-line-soft)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <span style={{ flex: 1, fontSize: '9px', color: 'var(--c-slate)', fontWeight: '600', lineHeight: '1.4' }}>{q}</span>
                <ChevronRight size={11} color="var(--c-muted)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* 대화 예시 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,200,61,0.15)', border: '1px solid var(--c-yellow-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sun size={14} color="#F59E0B" />
            </div>
            <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-line)', borderRadius: '4px 10px 10px 10px', padding: '8px 10px', maxWidth: '78%', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '8px', fontWeight: '700', color: 'var(--c-yellow-500)', marginBottom: '3px' }}>노밍의 한 줄 조언</div>
              <div style={{ fontSize: '8px', color: 'var(--c-slate)', lineHeight: '1.5' }}>비상금은 생활비 3~6개월치를 CMA나 파킹통장에 두는 게 좋아요.</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: 'linear-gradient(135deg, #21C58E, #0D9B6E)', borderRadius: '10px 4px 10px 10px', padding: '8px 10px', maxWidth: '72%' }}>
              <div style={{ fontSize: '8px', color: '#fff', lineHeight: '1.5' }}>비상금은 얼마나 모아야 하나요?</div>
            </div>
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <div style={{ flexShrink: 0, padding: '8px 12px 12px', background: 'var(--c-canvas)' }}>
        <div style={{ background: 'var(--c-surface)', border: '1.5px solid var(--c-line)', borderRadius: '10px', padding: '7px 8px 7px 12px', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <span style={{ flex: 1, fontSize: '8px', color: 'var(--c-muted)' }}>경제 고민을 입력해보세요</span>
          <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg, #21C58E, #0D9B6E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#fff' }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 경제한잎 화면 ───────────────────────────────────────── */
function BitesScreen() {
  const cards = [
    { title: '금리란 무엇인가요?',   cat: '금리', diff: '쉬움', isToday: true,  summary: '돈을 빌릴 때 내는 이용료. 금리가 오르면 대출이자가 늘어요.' },
    { title: '복리의 마법',          cat: '저축', diff: '쉬움', isToday: false, summary: '이자에 이자가 붙는 구조. 시간이 길수록 눈덩이처럼 불어나요.' },
    { title: 'ETF 투자 시작하기',    cat: '투자', diff: '보통', isToday: false, summary: '여러 주식을 한 바구니에 담은 상품. 분산 투자에 최적이에요.' },
  ];

  const cats = ['전체', '기초', '금리', '투자', '저축'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MockTopBar title="경제한잎" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 16px' }}>

        {/* 다크 히어로 배너 */}
        <div style={{
          background: 'linear-gradient(145deg, #0F6B52 0%, #06352B 100%)',
          borderRadius: '14px', padding: '14px 12px', marginBottom: '12px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 3px 14px rgba(6,53,43,0.28)',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10, width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                <Leaf size={8} color="rgba(255,255,255,0.65)" />
                <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.65)' }}>오늘의 추천 한잎</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px', marginBottom: '4px', lineHeight: 1.35 }}>금리란 무엇인가요?</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>돈을 빌릴 때 내는 이용료예요...</div>
            </div>
            <div style={{ width: '30px', height: '30px', flexShrink: 0, background: 'rgba(255,255,255,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={14} color="rgba(255,255,255,0.9)" />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '3px 10px' }}>
              읽으러 가기 →
            </span>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {cats.map((c, i) => (
            <span key={c} style={{
              padding: '4px 9px', borderRadius: '100px', fontSize: '8px', fontWeight: i === 0 ? '700' : '500',
              background: i === 0 ? 'var(--c-green-500)' : 'var(--c-surface)',
              color: i === 0 ? '#fff' : 'var(--c-slate)',
              border: `1px solid ${i === 0 ? 'var(--c-green-500)' : 'var(--c-line)'}`,
            }}>
              {c}
            </span>
          ))}
        </div>

        <div style={{ fontSize: '8px', color: 'var(--c-muted)', marginBottom: '8px' }}>24개의 경제 한잎</div>

        {/* 카드 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cards.map((b, i) => (
            <div key={i} style={{
              background: 'var(--c-surface)', border: `1px solid ${b.isToday ? 'var(--c-green-500)' : 'var(--c-line)'}`,
              borderRadius: '10px', padding: '11px 12px', position: 'relative',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              {b.isToday && (
                <div style={{ position: 'absolute', top: 9, right: 10, background: 'var(--c-green-500)', color: '#fff', fontSize: '7px', fontWeight: '700', padding: '1px 6px', borderRadius: '100px' }}>오늘</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                <span style={{ fontSize: '8px', fontWeight: '700', background: 'var(--c-green-50)', color: 'var(--c-forest-700)', borderRadius: '100px', padding: '1px 7px' }}>{b.cat}</span>
                <span style={{ fontSize: '8px', fontWeight: '600', background: b.diff === '쉬움' ? 'var(--c-green-100)' : 'var(--c-line-soft)', color: b.diff === '쉬움' ? 'var(--c-forest-700)' : 'var(--c-slate)', borderRadius: '100px', padding: '1px 7px' }}>{b.diff}</span>
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--c-ink)', letterSpacing: '-0.3px', marginBottom: '3px' }}>{b.title}</div>
              <div style={{ fontSize: '8px', color: 'var(--c-slate)', lineHeight: '1.5' }}>{b.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 경제일기 화면 ───────────────────────────────────────── */
function DiaryScreen() {
  const sections = [
    { Icon: BookOpen,   color: '#3B82F6',              title: '오늘 배운 것',       text: 'ETF는 여러 종목을 담은 투자 바구니와 비슷하다.' },
    { Icon: Newspaper,  color: '#8B5CF6',              title: '오늘의 금융 뉴스',   text: '한국은행 기준금리 3회 연속 동결' },
    { Icon: Lightbulb,  color: 'var(--c-yellow-500)', title: '뉴스를 보고 든 생각', text: '금리가 유지되면 예금 금리도 크게 변하지 않을 것 같다.' },
  ];

  const pastEntries = [
    { date: '2026.06.21', preview: '복리의 마법에 대해 배웠다.' },
    { date: '2026.06.20', preview: 'ETF와 주식의 차이점을 알게 됐다.' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MockTopBar title="경제일기" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* 날짜 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--c-ink)', letterSpacing: '-0.4px' }}>2026.06.22</div>
            <div style={{ fontSize: '8px', color: 'var(--c-muted)' }}>일요일</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #21C58E, #0D9B6E)', borderRadius: '7px', padding: '5px 10px', fontSize: '8px', fontWeight: '600', color: '#fff' }}>
            오늘 일기 작성
          </div>
        </div>

        {/* 섹션 카드들 */}
        {sections.map((s, i) => (
          <div key={i} style={{
            background: 'var(--c-surface)',
            border: `1.5px solid ${s.color}22`,
            borderRadius: '10px', padding: '10px 11px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.Icon size={10} color={s.color} />
              </div>
              <span style={{ fontSize: '8px', fontWeight: '700', color: 'var(--c-ink)' }}>{s.title}</span>
            </div>
            <div style={{ fontSize: '8px', color: 'var(--c-slate)', lineHeight: '1.6', paddingLeft: '2px' }}>{s.text}</div>
          </div>
        ))}

        {/* 지난 일기 */}
        <div style={{ fontSize: '8px', fontWeight: '700', color: 'var(--c-muted)', letterSpacing: '0.4px', marginTop: '4px' }}>지난 일기</div>
        {pastEntries.map((e, i) => (
          <div key={i} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-line-soft)', borderRadius: '9px', padding: '9px 11px' }}>
            <div style={{ fontSize: '8px', color: 'var(--c-muted)', marginBottom: '3px' }}>{e.date}</div>
            <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--c-ink)' }}>{e.preview}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
