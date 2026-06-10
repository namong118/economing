/* 하단 네비게이션 바 */
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/home', icon: '🏠', label: '홈' },
  { path: '/roadmap', icon: '🗺️', label: '로드맵' },
  { path: '/terms', icon: '🔍', label: '용어' },
  { path: '/dictionary', icon: '📚', label: '사전' },
  { path: '/diary', icon: '✏️', label: '일기' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        background: '#FFFFFF',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
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
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#10B981' : '#9CA3AF',
                letterSpacing: '-0.3px',
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#10B981',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
