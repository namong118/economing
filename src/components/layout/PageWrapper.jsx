import { useRef, useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function PageWrapper({ children, showNav = true, style = {} }) {
  const [showTop, setShowTop] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    const check = () =>
      setShowTop((el?.scrollTop ?? 0) > 300 || window.scrollY > 300);
    el?.addEventListener('scroll', check, { passive: true });
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      el?.removeEventListener('scroll', check);
      window.removeEventListener('scroll', check);
    };
  }, []);

  const toTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page" style={style}>
      {showNav && <TopNav />}
      <div className="page-content" ref={contentRef}>
        {children}
      </div>
      {showNav && <BottomNav />}
      <button
        className={`scroll-top-btn${showTop ? ' visible' : ''}`}
        onClick={toTop}
        aria-label="맨 위로"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
