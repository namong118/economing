import { Outlet } from 'react-router-dom';
import DesktopShell from './DesktopShell';

export default function AppShell() {
  return (
    <DesktopShell>
      <Outlet />
    </DesktopShell>
  );
}
