import BrandPanel from './BrandPanel';

export default function DesktopShell({ children }) {
  return (
    <div className="ds-root">
      {/* 화면 전체로 퍼지는 배경 블롭 — 브랜드 패널 폭(640px)에 갇히지 않도록 루트 레벨에 배치 */}
      <span className="ds-blob ds-blob1" />
      <span className="ds-blob ds-blob2" />
      <span className="ds-blob ds-blob3" />
      <span className="ds-blob ds-blob4" />

      <BrandPanel />
      {/* 우측 앱 컬럼 — 480px 고정, 스크롤 컨테이너 역할 (데스크톱) */}
      <main className="ds-app">
        {children}
      </main>
    </div>
  );
}
