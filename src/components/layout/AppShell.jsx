import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DesktopShell from './DesktopShell';
import { recordVisit } from '../../utils/navigationHistory';

export default function AppShell() {
  const location = useLocation();

  // 지표 상세·한잎 상세의 동적 뒤로가기 라벨("← 경제읽기" 등)을 위해
  // 방문 경로를 기록한다 — StickyBackButton 참고.
  useEffect(() => {
    recordVisit(location.pathname);
  }, [location.pathname]);

  return (
    <DesktopShell>
      <Outlet />
    </DesktopShell>
  );
}
