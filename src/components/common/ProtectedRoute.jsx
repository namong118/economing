/**
 * ProtectedRoute — 로그인이 필요한 페이지를 보호하는 컴포넌트
 *
 * 사용 방법 (App.jsx):
 *   <Route path="/diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
 *
 * 동작:
 *   - 로그인 확인 중 → 로딩 스피너 표시
 *   - 로그인 안 됨   → /login 페이지로 이동
 *   - 로그인 됨      → 원래 페이지 표시
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 세션 확인 중일 때는 잠깐 로딩 화면 표시
  if (loading) {
    return (
      <div
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          minHeight:      '100vh',
          background:     'var(--bg)',
          gap:            '16px',
        }}
      >
        <div style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>⏳</div>
        <p style={{ fontSize: '15px', color: '#64748B', fontWeight: '500' }}>로딩 중...</p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 보냄
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 로그인된 경우 원래 페이지를 그대로 보여줌
  return children;
}
