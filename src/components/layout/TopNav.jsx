/* 상단 네비게이션 바 (PC 웹 메인 네비) */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/home',       label: '홈' },
  { path: '/coach',      label: 'AI 코치' },
  { path: '/roadmap',    label: '로드맵' },
  { path: '/diary',      label: '경제일기' },
  { path: '/dictionary', label: '경제사전' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 로그인 상태 가져오기 (AuthContext)
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/home');
  };

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-inner">
          {/* 로고 */}
          <button
            onClick={() => navigate('/home')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0', flexShrink: 0,
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}icon.jpg`}
              alt="ECONOMING"
              style={{
                width: '32px', height: '32px', borderRadius: '10px',
                objectFit: 'cover', boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
              }}
            />
            <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.8px', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EC</span>
              <span style={{
                display: 'inline-block', width: '13px', height: '13px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                flexShrink: 0, margin: '0 1px',
                boxShadow: '0 1px 4px rgba(245,158,11,0.4)',
              }} />
              <span style={{ background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>N</span>
              <span style={{
                display: 'inline-block', width: '13px', height: '13px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                flexShrink: 0, margin: '0 1px',
                boxShadow: '0 1px 4px rgba(245,158,11,0.4)',
              }} />
              <span style={{ background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MING</span>
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
                    padding: '8px 16px', borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#10B981' : '#64748B',
                    background: isActive ? '#ECFDF5' : 'transparent',
                    transition: 'all 0.15s ease', letterSpacing: '-0.3px',
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

          {/* 우측: 로그인 상태에 따라 다른 버튼 표시 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {user ? (
              /* ── 로그인된 상태 ── */
              <>
                {/* 닉네임 표시 */}
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', borderRadius: '10px',
                    background: '#F0FDF4', border: '1px solid #BBF7D0',
                    cursor: 'pointer',
                  }}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="프로필"
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: '#fff', fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {(profile?.nickname || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#064E3B', whiteSpace: 'nowrap' }}>
                    {profile?.nickname || user.email || '내 정보'}
                  </span>
                </button>

                {/* 로그아웃 버튼 */}
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '8px 14px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '600',
                    color: '#64748B', background: '#F1F5F9',
                    border: '1px solid #E2E8F0', cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEF2F2';
                    e.currentTarget.style.color = '#DC2626';
                    e.currentTarget.style.borderColor = '#FECACA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  로그아웃
                </button>
              </>
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

            {/* 모바일 햄버거 버튼 */}
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

        {/* 모바일 메뉴 하단 - 로그인/로그아웃 */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid #E2E8F0' }}>
          {user ? (
            <button
              onClick={() => { handleSignOut(); setMenuOpen(false); }}
              style={{
                padding: '12px', width: '100%', borderRadius: '10px',
                background: '#FEF2F2', color: '#DC2626',
                border: '1px solid #FECACA', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
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
