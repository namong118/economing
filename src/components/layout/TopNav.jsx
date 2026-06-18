import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/home',      label: '홈' },
  { path: '/bites',     label: '경제한잎' },
  { path: '/coach',     label: '노밍' },
  { path: '/read',      label: '경제읽기' },
  { path: '/my-growth', label: '내 성장' },
];

/* ── 프로필 드롭다운 ──────────────────────────────────────── */
function ProfileDropdown({ user, profile, onClose, navigate, signOut }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: '#fff', borderRadius: '14px',
      border: '1.5px solid var(--c-line)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      minWidth: '180px', overflow: 'hidden', zIndex: 200,
    }}>
      {/* 사용자 정보 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--c-line-soft)' }}>
        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--c-ink)', marginBottom: '2px' }}>
          {profile?.nickname || user.email || '사용자'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--c-muted)' }}>
          {user.email || '소셜 로그인'}
        </p>
      </div>
      {/* 메뉴 아이템 */}
      <DropItem
        Icon={TrendingUp}
        label="내 성장"
        onClick={() => { navigate('/my-growth'); onClose(); }}
      />
      <DropItem
        Icon={LogOut}
        label="로그아웃"
        danger
        onClick={async () => { await signOut(); navigate('/home'); onClose(); }}
      />
    </div>
  );
}

function DropItem({ Icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '11px 16px',
        background: hov ? (danger ? '#FEF2F2' : 'var(--c-surface)') : 'transparent',
        border: 'none', cursor: 'pointer',
        fontSize: '14px', fontWeight: '600',
        color: danger ? '#DC2626' : 'var(--c-slate)',
        textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      <Icon size={16} color={danger ? '#DC2626' : 'var(--c-slate)'} />
      {label}
    </button>
  );
}

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

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
          {/* 로고 — 가운데 고정 */}
          <button
            onClick={() => navigate('/home')}
            style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="ECONOMING"
              style={{ height: 68, width: 'auto' }}
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
                    color: isActive ? 'var(--c-forest-700)' : 'var(--c-slate)',
                    background: isActive ? 'var(--c-green-100)' : 'transparent',
                    transition: 'all 0.15s ease', letterSpacing: '-0.2px',
                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--c-surface)';
                      e.currentTarget.style.color = 'var(--c-ink)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--c-slate)';
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
                      background: 'var(--c-green-50)',
                      border: dropOpen ? '1.5px solid var(--c-green-500)' : '1px solid var(--c-green-300)',
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
                        background: 'var(--c-green-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', color: '#fff', fontWeight: '700', flexShrink: 0,
                      }}>
                        {(profile?.nickname || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--c-forest-900)', whiteSpace: 'nowrap' }}>
                      {profile?.nickname || user.email || '내 정보'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--c-slate)', marginLeft: '2px' }}>
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
                      color: 'var(--c-slate)', background: 'var(--c-surface)',
                      border: '1.5px solid var(--c-line)', cursor: 'pointer',
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--c-green-500)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--c-line)'}
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => navigate('/diagnosis')}
                    style={{
                      padding: '8px 18px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '700',
                      background: 'var(--grad-action)',
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


          </div>
        </div>
      </nav>
    </>
  );
}
