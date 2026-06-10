/* ECONOMING 앱 - 라우팅 설정 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DiagnosisPage  from './pages/DiagnosisPage';
import ResultPage     from './pages/ResultPage';
import HomePage       from './pages/HomePage';
import CoachPage      from './pages/CoachPage';
import RoadmapPage    from './pages/RoadmapPage';
import TermsPage      from './pages/TermsPage';
import DictionaryPage from './pages/DictionaryPage';
import DiaryPage      from './pages/DiaryPage';
import LoginPage      from './pages/LoginPage';
import SignupPage     from './pages/SignupPage';

export default function App() {
  return (
    /*
     * AuthProvider: 앱 전체에 로그인 상태를 공급합니다.
     * Router 바깥이 아닌 안쪽에 두어도 되지만,
     * Router 안에 두면 내부 컴포넌트에서 useNavigate를 쓸 수 있습니다.
     */
    <Router>
      <AuthProvider>
        <div className="app-shell">
          <Routes>
            {/* / → 홈 대시보드로 바로 이동 */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* 인증 페이지 (TopNav 없는 독립 레이아웃) */}
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* AI 진단 플로우 */}
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/result"    element={<ResultPage />} />

            {/* 보호된 페이지 (로그인 필요) — 홈 포함 */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* 공개 페이지 (로그인 없이도 볼 수 있음) */}
            <Route path="/coach"   element={<CoachPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/terms"   element={<TermsPage />} />

            {/* 보호된 페이지 (로그인 필요) */}
            <Route
              path="/dictionary"
              element={
                <ProtectedRoute>
                  <DictionaryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diary"
              element={
                <ProtectedRoute>
                  <DiaryPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
