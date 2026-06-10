import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, session, profile, signOut } = useAuth();

  const provider =
    user?.app_metadata?.provider ||
    user?.identities?.[0]?.provider ||
    'unknown';

  const handleSignOut = async () => {
    await signOut();
    navigate('/home');
  };

  if (!user) {
    return (
      <PageWrapper>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ color: '#64748B' }}>로그인이 필요해요.</p>
          <button
            onClick={() => navigate('/login')}
            style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '10px', background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700' }}
          >
            로그인하기
          </button>
        </div>
      </PageWrapper>
    );
  }

  const rows = [
    { label: 'user.id',       value: user.id },
    { label: 'email',         value: user.email || '(없음 — 소셜 로그인)' },
    { label: 'provider',      value: provider },
  ];

  const profileRows = [
    { label: 'nickname',    value: profile?.nickname   ?? '(없음)' },
    { label: 'avatar_url',  value: profile?.avatar_url ?? '(없음)' },
    { label: 'email',       value: profile?.email      ?? '(없음)' },
    { label: 'provider',    value: profile?.provider   ?? '(없음)' },
    { label: 'level',       value: profile?.level      ?? '(없음)' },
    { label: 'created_at',  value: profile?.created_at ?? '(없음)' },
  ];

  return (
    <PageWrapper>
      <div style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.6px' }}>
          내 정보 (디버그)
        </h2>

        {/* 프로필 아이콘 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="프로필"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', color: '#fff', fontWeight: '700',
            }}>
              {(profile?.nickname || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              {profile?.nickname || '닉네임 없음'}
            </p>
            <p style={{ fontSize: '13px', color: '#64748B' }}>{provider} 로그인</p>
          </div>
        </div>

        {/* Supabase Auth 정보 */}
        <Section title="Supabase Auth">
          {rows.map(r => <Row key={r.label} label={r.label} value={r.value} />)}
        </Section>

        {/* profiles 테이블 */}
        <Section title="profiles 테이블">
          {profileRows.map(r => <Row key={r.label} label={r.label} value={r.value} />)}
        </Section>

        {/* user_metadata */}
        <Section title="user_metadata">
          <pre style={preStyle}>{JSON.stringify(user.user_metadata, null, 2)}</pre>
        </Section>

        {/* app_metadata */}
        <Section title="app_metadata">
          <pre style={preStyle}>{JSON.stringify(user.app_metadata, null, 2)}</pre>
        </Section>

        {/* 로그아웃 */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px',
            background: '#FEF2F2', color: '#DC2626',
            border: '1px solid #FECACA', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer', marginTop: '8px',
          }}
        >
          로그아웃
        </button>
      </div>
    </PageWrapper>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
        {title}
      </p>
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '12px 16px', borderBottom: '1px solid #F1F5F9', gap: '12px' }}>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', minWidth: '110px', flexShrink: 0, fontFamily: 'monospace' }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#0F172A', wordBreak: 'break-all', fontFamily: 'monospace' }}>
        {value}
      </span>
    </div>
  );
}

const preStyle = {
  margin: 0,
  padding: '14px 16px',
  fontSize: '12px',
  color: '#374151',
  lineHeight: '1.6',
  overflowX: 'auto',
  fontFamily: 'monospace',
};
