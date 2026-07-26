import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrandPanel from './BrandPanel';

/*
 * 발표용 페이지 레이아웃 — AppShell(DesktopShell)과 별개.
 * 좌측 브랜드 패널은 고정, 우측 콘텐츠 영역만 내부 스크롤(데스크톱).
 * 발표용 페이지는 데스크톱 전용 — 모바일(<1024px)에서는 콘텐츠를 렌더링하지 않고
 * /home으로 리다이렉트한다. 리사이즈로 폭이 좁아지는 경우도 동일하게 처리.
 */
export default function PresentationShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    function handleChange(e) {
      if (!e.matches) navigate('/home', { replace: true });
    }
    if (!desktopQuery.matches) {
      navigate('/home', { replace: true });
    }
    desktopQuery.addEventListener('change', handleChange);
    return () => desktopQuery.removeEventListener('change', handleChange);
  }, [navigate]);

  /* 스크롤 시 섹션 등장 — 기존 .bp-reveal/.bp-visible 재사용, root를 우측 콘텐츠로 지정 */
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bp-visible');
          io.unobserve(entry.target);
        }
      });
    }, { root, threshold: 0.15 });

    const els = root.querySelectorAll('.bp-reveal:not(.bp-visible)');
    els.forEach(el => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return (
    <div className="ps-root">
      {/* DesktopShell과 동일한 배경 블롭 — 화면 전체(앱 컬럼 제외)로 이어지도록 재사용 */}
      <span className="ds-blob ds-blob1" />
      <span className="ds-blob ds-blob2" />
      <span className="ds-blob ds-blob3" />
      <span className="ds-blob ds-blob4" />

      <BrandPanel />
      <div className="ps-content" ref={contentRef}>
        <div className="ps-back-bar">
          <button className="ps-back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={16} />
            앱으로 돌아가기
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
