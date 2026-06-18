import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.BASE_URL;

export default function DesktopShell({ children }) {
  const navigate = useNavigate();

  return (
    <div className="ds-root">
      {/* 좌측 브랜드 패널 — 데스크톱(≥1024px)에서만 표시 */}
      <aside className="ds-brand">
        <div className="ds-brand-inner">
          <div className="ds-logo">
            <img
              src={`${BASE_URL}appicon.jpg`}
              alt="ECONOMING 앱 아이콘"
              style={{ width: 160, height: 160, borderRadius: 36, display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.16)', marginLeft: 48 }}
            />
          </div>

          <p className="ds-desc">
            ECONOMING은 매일 한 잎씩 경제를<br />
            배우고 기록하며 성장하는<br />
            AI 경제 코치 서비스입니다.
          </p>

          <p className="ds-desc ds-desc-accent">
            QR 코드를 스캔하고<br />
            모바일 환경에서<br />
            더 편하게 학습하세요!
          </p>

          {/* QR 목업 */}
          <div style={{ marginBottom: 38, marginLeft: 8, display: 'inline-block' }}>
            <div style={{
              width: 120, height: 120,
              background: 'var(--c-green-50)',
              border: '2px dashed var(--c-green-300)',
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 32 }}>📱</span>
              <span style={{ fontSize: 10, color: 'var(--c-muted)', fontWeight: 600 }}>곧 제공 예정</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 6, textAlign: 'center', letterSpacing: '-0.2px' }}>
              웹 버전 바로가기 QR
            </p>
          </div>

          <div className="ds-divider" />

          <div className="ds-tagline">매일 한 잎, 경제가 자라는 습관</div>
          <div className="ds-tagline ds-tagline-accent">Grow your money sense!</div>

          <div className="ds-btns">
            <button className="ds-outline" onClick={() => navigate('/coach')}>
              노밍 소개
            </button>
            <button className="ds-outline" onClick={() => navigate('/bites')}>
              오늘의 한잎
            </button>
          </div>
        </div>
      </aside>

      {/* 우측 앱 컬럼 — 480px 고정, 스크롤 컨테이너 역할 (데스크톱) */}
      <main className="ds-app">
        {children}
      </main>
    </div>
  );
}
