import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 세션 초기화 중 — profile 로드 완료 후에 렌더링
  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg)', gap: '16px',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid #E2E8F0', borderTopColor: '#10B981',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>잠시만요...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 비로그인 — 로그인 페이지로 이동
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 완료 — 페이지 렌더링
  return children;
}
