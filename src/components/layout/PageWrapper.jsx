/* 페이지 공통 래퍼 — PC 웹 레이아웃, TopNav 포함 */
import TopNav from './TopNav';

export default function PageWrapper({ children, showNav = true, style = {} }) {
  return (
    <div className="page" style={style}>
      {showNav && <TopNav />}
      {children}
    </div>
  );
}
