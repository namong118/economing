import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/home',      label: '홈' },
  { path: '/coach',     label: '노밍' },
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

  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
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
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="ECONOMING"
              style={{ height: 56, width: 'auto' }}
            />
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
                    color: isActive ? '#2A7A4B' : '#64748B',
                    background: isActive ? '#E3F9EC' : 'transparent',
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

            {/* PC: 프로필/인증 버튼 */}
            <div className="nav-right-desktop">
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
                        background: '#52C97A',
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
            </div>

            {/* 모바일: 햄버거 버튼 + 드롭다운 */}
            <div ref={menuRef}>
              <button
                className="nav-hamburger"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="메뉴"
              >
                {menuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <line x1="5" y1="5" x2="17" y2="17" stroke="#2A7A4B" strokeWidth="2.2" strokeLinecap="round"/>
                    <line x1="17" y1="5" x2="5" y2="17" stroke="#2A7A4B" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <line x1="3" y1="7"  x2="19" y2="7"  stroke="#2A7A4B" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="3" y1="11" x2="19" y2="11" stroke="#2A7A4B" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="3" y1="15" x2="19" y2="15" stroke="#2A7A4B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>

              {menuOpen && (
                <div className="nav-mobile-menu">
                  {/* 네비 링크 */}
                  {navLinks.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <button
                        key={link.path}
                        onClick={() => { navigate(link.path); setMenuOpen(false); }}
                        style={{
                          width: '100%', padding: '14px 24px',
                          background: isActive ? '#E3F9EC' : 'none',
                          border: 'none', textAlign: 'left',
                          fontSize: '15px', fontWeight: isActive ? '600' : '500',
                          color: isActive ? '#2A7A4B' : '#374151',
                          cursor: 'pointer',
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  })}

                  <hr style={{ border: 'none', borderTop: '0.5px solid #E2E8F0', margin: '4px 0' }} />

                  {user ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: '#52C97A', color: '#fff', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '15px', fontWeight: '700',
                        }}>
                          {(profile?.nickname || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>
                            {profile?.nickname || user.email || '사용자'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                            {user.email || '소셜 로그인'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={async () => { await signOut(); navigate('/home'); setMenuOpen(false); }}
                        style={{
                          width: '100%', padding: '12px 24px',
                          background: 'none', border: 'none', textAlign: 'left',
                          fontSize: '14px', fontWeight: '600', color: '#DC2626',
                          cursor: 'pointer',
                        }}
                      >
                        🚪 로그아웃
                      </button>
                    </>
                  ) : (
                    <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => { navigate('/login'); setMenuOpen(false); }}
                        style={{
                          padding: '12px', borderRadius: '10px',
                          fontSize: '14px', fontWeight: '600',
                          color: '#374151', background: '#F8FAFC',
                          border: '1.5px solid #E2E8F0', cursor: 'pointer',
                        }}
                      >
                        로그인
                      </button>
                      <button
                        onClick={() => { navigate('/diagnosis'); setMenuOpen(false); }}
                        style={{
                          padding: '12px', borderRadius: '10px',
                          fontSize: '14px', fontWeight: '700',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#fff', border: 'none', cursor: 'pointer',
                        }}
                      >
                        AI 진단 시작
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
