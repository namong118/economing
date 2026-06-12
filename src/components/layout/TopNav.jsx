import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/home',      label: '홈' },
  { path: '/coach',     label: 'AI 코치' },
  { path: '/read',      label: '경제 읽기' },
  { path: '/my-growth', label: '내 성장' },
];

/* ── 프로필 드롭다운 ──────────────────────────────────────── */
function ProfileDropdown({ user, profile, onClose, navigate, signOut }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: '#fff', borderRadius: '14px',
      border: '1.5px solid #E2E8F0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      minWidth: '180px', overflow: 'hidden', zIndex: 200,
    }}>
      {/* 사용자 정보 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '2px' }}>
          {profile?.nickname || user.email || '사용자'}
        </p>
        <p style={{ fontSize: '12px', color: '#94A3B8' }}>
          {user.email || '소셜 로그인'}
        </p>
      </div>
      {/* 메뉴 아이템 */}
      <DropItem
        icon="🌱"
        label="내 성장"
        onClick={() => { navigate('/my-growth'); onClose(); }}
      />
      <DropItem
        icon="🚪"
        label="로그아웃"
        danger
        onClick={async () => { await signOut(); navigate('/home'); onClose(); }}
      />
    </div>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '11px 16px',
        background: hov ? (danger ? '#FEF2F2' : '#F8FAFC') : 'transparent',
        border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600',
        color: danger ? '#DC2626' : '#374151',
        textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );
}

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef   = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-inner">
          {/* 로고 */}
          <button
            onClick={() => navigate('/home')}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0', flexShrink: 0,
            }}
          >
            <span style={{
              fontSize: '18px', fontWeight: '900', letterSpacing: '-0.8px',
              display: 'inline-flex', alignItems: 'center', lineHeight: 1,
            }}>
              <span style={{ color: '#085041' }}>ECON</span>
              {/* 노란 원(O) + 위에서 자라나는 새싹 잎 2개 */}
              <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, margin: '0 1px' }}>
                <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5 C4.5 3.5 1.5 2.5 2 0.5 C3 0 6.5 0.5 7 5Z" fill="#21C58E" />
                  <path d="M7 5 C9.5 3.5 12.5 2.5 12 0.5 C11 0 7.5 0.5 7 5Z" fill="#21C58E" />
                  <circle cx="7" cy="11" r="6.5" fill="#FFC83D" />
                </svg>
              </span>
              <span style={{ color: '#085041' }}>MING</span>
            </span>
          </button>

          {/* PC 네비 링크 */}
          <div className="nav-links" style={{ gap: '2px' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: isActive ? '500' : '400',
                    color: isActive ? '#085041' : '#64748B',
                    background: isActive ? '#E1F5EE' : 'transparent',
                    transition: 'all 0.15s ease', letterSpacing: '-0.2px',
                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = '#0F172A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* 우측 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              /* ── 로그인 상태: 프로필 드롭다운 ── */
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', borderRadius: '10px',
                    background: dropOpen ? '#ECFDF5' : '#F0FDF4',
                    border: dropOpen ? '1.5px solid #A7F3D0' : '1px solid #BBF7D0',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="프로필"
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: '#21C58E',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', color: '#fff', fontWeight: '700', flexShrink: 0,
                    }}>
                      {(profile?.nickname || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#064E3B', whiteSpace: 'nowrap' }}>
                    {profile?.nickname || user.email || '내 정보'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '2px' }}>
                    {dropOpen ? '▲' : '▼'}
                  </span>
                </button>
                {dropOpen && (
                  <ProfileDropdown
                    user={user}
                    profile={profile}
                    onClose={() => setDropOpen(false)}
                    navigate={navigate}
                    signOut={signOut}
                  />
                )}
              </div>
            ) : (
              /* ── 비로그인 상태 ── */
              <>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '8px 16px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '600',
                    color: '#374151', background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0', cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/diagnosis')}
                  style={{
                    padding: '8px 18px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '700',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                    letterSpacing: '-0.3px', whiteSpace: 'nowrap',
                  }}
                >
                  AI 진단 시작
                </button>
              </>
            )}

            {/* 모바일 햄버거 */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', border: 'none', cursor: 'pointer',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      <div className={`nav-mobile-menu ${menuOpen ? 'mobile-open' : ''}`}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{
                padding: '14px 24px', fontSize: '15px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#10B981' : '#374151',
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              {link.label}
            </button>
          );
        })}

        <div style={{ padding: '12px 24px', borderTop: '1px solid #E2E8F0' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => { navigate('/my-growth'); setMenuOpen(false); }}
                style={{
                  padding: '12px', width: '100%', borderRadius: '10px',
                  background: '#F0FDF4', color: '#064E3B',
                  border: '1px solid #BBF7D0', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                🌱 내 성장
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/home'); setMenuOpen(false); }}
                style={{
                  padding: '12px', width: '100%', borderRadius: '10px',
                  background: '#FEF2F2', color: '#DC2626',
                  border: '1px solid #FECACA', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => { navigate('/login'); setMenuOpen(false); }}
              style={{
                padding: '12px', width: '100%', borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', border: 'none', fontSize: '14px',
                fontWeight: '700', cursor: 'pointer',
              }}
            >
              로그인 / 회원가입
            </button>
          )}
        </div>
      </div>
    </>
  );
}
