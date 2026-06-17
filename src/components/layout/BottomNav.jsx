import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Leaf, Newspaper, TrendingUp } from 'lucide-react';

const navItems = [
  { path: '/home',      Icon: Home,        label: '홈',      type: 'lucide' },
  { path: '/bites',     Icon: Leaf,        label: '한잎',    type: 'lucide' },
  { path: '/coach',     Icon: null,        label: '노밍',    type: 'img'    },
  { path: '/read',      Icon: Newspaper,   label: '경제읽기', type: 'lucide' },
  { path: '/my-growth', Icon: TrendingUp,  label: '내 성장', type: 'lucide' },
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
        background: '#FFFFFF',
        borderTop: '0.5px solid #DCF0E0',
        display: 'flex',
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
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
              padding: '10px 0 12px',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            {item.type === 'img' ? (
              <img
                src={`${import.meta.env.BASE_URL}noming.png`}
                alt="노밍"
                style={{
                  width: 22, height: 22, objectFit: 'contain',
                  opacity: isActive ? 1 : 0.45,
                }}
              />
            ) : (
              <item.Icon size={22} color={isActive ? '#52C97A' : '#9CA3AF'} />
            )}
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#52C97A' : '#9CA3AF',
              letterSpacing: '-0.3px',
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#52C97A',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
