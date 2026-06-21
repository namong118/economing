import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Leaf, Newspaper, TrendingUp, Sun } from 'lucide-react';

const navItems = [
  { path: '/home',      Icon: Home,       label: '홈'      },
  { path: '/bites',     Icon: Leaf,       label: '한잎'    },
  { path: '/coach',     Icon: Sun,        label: '노밍'    },
  { path: '/read',      Icon: Newspaper,  label: '경제읽기' },
  { path: '/my-growth', Icon: TrendingUp, label: '내 성장' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--c-surface)',
        borderTop: '0.5px solid var(--c-line)',
        display: 'flex',
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
        boxShadow: '0 -2px 12px rgba(8,53,43,0.06)',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 10px',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            {/* 액티브 표시: 상단 pill 인디케이터 */}
            <div style={{
              position: 'absolute',
              top: 0,
              width: isActive ? '24px' : '0px',
              height: '2.5px',
              borderRadius: '0 0 3px 3px',
              background: 'var(--c-green-500)',
              transition: 'width 0.2s ease',
            }} />

            <item.Icon
              size={22}
              color={isActive ? 'var(--c-green-500)' : 'var(--icon-inactive)'}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? 'var(--c-green-500)' : 'var(--icon-inactive)',
              letterSpacing: '-0.3px',
              transition: 'color 0.15s',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
