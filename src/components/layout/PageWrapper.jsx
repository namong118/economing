import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function PageWrapper({ children, showNav = true, style = {} }) {
  return (
    <div className="page" style={style}>
      {showNav && <TopNav />}
      <div className="page-content">
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
