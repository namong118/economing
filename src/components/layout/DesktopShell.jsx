import BrandPanel from './BrandPanel';

export default function DesktopShell({ children }) {
  return (
    <div className="ds-root">
      <BrandPanel />
      {/* 우측 앱 컬럼 — 480px 고정, 스크롤 컨테이너 역할 (데스크톱) */}
      <main className="ds-app">
        {children}
      </main>
    </div>
  );
}
