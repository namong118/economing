import { useState } from 'react';

const SCREENS = [
  {
    key: 'home',
    label: '홈',
    content: <HomeScreen />,
  },
  {
    key: 'coach',
    label: 'AI 코치',
    content: <CoachScreen />,
  },
  {
    key: 'diary',
    label: '경제일기',
    content: <DiaryScreen />,
  },
  {
    key: 'growth',
    label: '내 성장',
    content: <GrowthScreen />,
  },
];

export default function AppPreviewSection() {
  const [active, setActive] = useState('home');
  const current = SCREENS.find(s => s.key === active);

  return (
    <section style={{
      background: '#fff',
      padding: 'clamp(60px, 8vw, 100px) 24px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* 헤더 */}
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
            fontWeight: '900', color: '#0F1F18',
            letterSpacing: '-1px', lineHeight: '1.25',
          }}>
            이런 화면으로<br/>공부하게 됩니다.
          </h2>
        </div>

        {/* 탭 선택기 */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px',
          marginBottom: '36px', flexWrap: 'wrap',
        }}>
          {SCREENS.map(s => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              style={{
                padding: '9px 20px', borderRadius: '100px',
                border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: active === s.key ? '700' : '500',
                background: active === s.key ? '#21C58E' : '#F1F5F9',
                color: active === s.key ? '#fff' : '#64748B',
                transition: 'all 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 폰 목업 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhoneFrame>
            {current.content}
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
      {/* 노치 */}
      <div style={{
        width: '80px', height: '24px',
        background: '#1C1C1E', borderRadius: '0 0 16px 16px',
        margin: '0 auto 4px',
        position: 'relative', zIndex: 1,
      }}/>
      {/* 화면 */}
      <div style={{
        background: '#F4FAF6',
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

function MockTopBar({ title }) {
  return (
    <div style={{
      background: '#fff',
      padding: '14px 16px 12px',
      borderBottom: '1px solid #F1F5F9',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '-0.5px', color: '#21C58E' }}>
        ECONOMING
      </span>
      <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F1F18' }}>{title}</span>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8FAF3' }}/>
    </div>
  );
}

function HomeScreen() {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <MockTopBar title="홈" />
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 인사 */}
        <div style={{ background: 'linear-gradient(135deg, #21C58E, #16A374)', borderRadius: '16px', padding: '16px' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>안녕하세요 👋</p>
          <p style={{ fontSize: '14px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>오늘도 성장해봐요!</p>
        </div>
        {/* 오늘의 학습 */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid #E8FAF3' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#21C58E', marginBottom: '8px' }}>📖 오늘의 경제</p>
          <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', marginBottom: '6px' }}/>
          <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', width: '70%' }}/>
        </div>
        {/* 로드맵 */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid #E8FAF3' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#374151', marginBottom: '10px' }}>🗺️ 내 로드맵</p>
          {[70, 40, 10].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ flex: 1, height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${w}%`, height: '100%', background: '#21C58E', borderRadius: '3px' }}/>
              </div>
              <span style={{ fontSize: '9px', color: '#94A3B8', minWidth: '28px' }}>{w}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoachScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MockTopBar title="AI 코치" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* AI 메시지 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8FAF3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🌱</div>
          <div style={{ background: '#fff', borderRadius: '14px 14px 14px 4px', padding: '10px 12px', maxWidth: '75%', border: '1px solid #E8FAF3' }}>
            <p style={{ fontSize: '11px', color: '#374151', lineHeight: '1.5' }}>ETF는 여러 주식을 묶어서 거래하는 펀드예요. 쉽게 말하면...</p>
          </div>
        </div>
        {/* 사용자 메시지 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: 'linear-gradient(135deg, #21C58E, #16A374)', borderRadius: '14px 14px 4px 14px', padding: '10px 12px', maxWidth: '75%' }}>
            <p style={{ fontSize: '11px', color: '#fff', lineHeight: '1.5' }}>ETF가 뭔지 쉽게 설명해줘</p>
          </div>
        </div>
        {/* AI 답변 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E8FAF3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🌱</div>
          <div style={{ background: '#fff', borderRadius: '14px 14px 14px 4px', padding: '10px 12px', maxWidth: '75%', border: '1px solid #E8FAF3' }}>
            <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', marginBottom: '5px' }}/>
            <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', width: '80%' }}/>
          </div>
        </div>
      </div>
      {/* 입력창 */}
      <div style={{ padding: '12px 14px', background: '#fff', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ background: '#F4FAF6', borderRadius: '100px', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>궁금한 경제 개념을 물어보세요</span>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#21C58E' }}/>
        </div>
      </div>
    </div>
  );
}

function DiaryScreen() {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <MockTopBar title="경제일기" />
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 작성 버튼 */}
        <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '14px', padding: '14px', border: '1px dashed #93C5FD', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '4px' }}>✏️</p>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#3B82F6' }}>오늘 일기 작성하기</p>
        </div>
        {/* 일기 목록 */}
        {['오늘 ETF에 대해 배웠다', '금리와 물가의 관계', 'GDP가 뭔지 알게 됐다'].map((title, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '14px', border: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '6px' }}>2026.06.0{i + 9}</p>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#0F1F18', letterSpacing: '-0.3px' }}>{title}</p>
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {['😊', '📈', '💡'].slice(0, i + 1).map((e, j) => (
                <span key={j} style={{ fontSize: '14px' }}>{e}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthScreen() {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <MockTopBar title="내 성장" />
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 성장 카드 */}
        <div style={{ background: 'linear-gradient(135deg, #21C58E, #0D9B6E)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌱</div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>현재 단계</p>
          <p style={{ fontSize: '16px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>새싹 경제인</p>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '100px', height: '6px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '42%', height: '100%', background: '#FFC83D', borderRadius: '100px' }}/>
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>다음 단계까지 58%</p>
        </div>
        {/* 통계 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[['📖', '읽은 글', '12개'], ['📓', '일기', '8개'], ['📚', '저장 용어', '24개'], ['☀️', '코치 질문', '16개']].map(([e, l, v]) => (
            <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '14px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: '20px', marginBottom: '4px' }}>{e}</p>
              <p style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>{l}</p>
              <p style={{ fontSize: '14px', fontWeight: '800', color: '#0F1F18', letterSpacing: '-0.5px' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
