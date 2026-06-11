import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './components/common/ProtectedRoute';
import LandingPage     from './pages/LandingPage';
import DiagnosisPage   from './pages/DiagnosisPage';
import ResultPage      from './pages/ResultPage';
import HomePage        from './pages/HomePage';
import CoachPage       from './pages/CoachPage';
import RoadmapPage     from './pages/RoadmapPage';
import TermsPage       from './pages/TermsPage';
import DictionaryPage  from './pages/DictionaryPage';
import DiaryPage       from './pages/DiaryPage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import OnboardingPage  from './pages/OnboardingPage';
import ReadingPage     from './pages/ReadingPage';
import MyGrowthHubPage       from './pages/MyGrowthHubPage';
import EconomicBitePage      from './pages/EconomicBitePage';
import EconomicBiteArchivePage from './pages/EconomicBiteArchivePage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* 인증 (TopNav 없는 독립 레이아웃) */}
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/signup"     element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* AI 진단 플로우 */}
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/result"    element={<ResultPage />} />

            {/* ── 학습 영역 (공개) ── */}
            <Route path="/home"    element={<HomePage />} />
            <Route path="/coach"   element={<CoachPage />} />
            <Route path="/read"    element={<ReadingPage />} />
            <Route path="/terms"   element={<TermsPage />} />
            <Route path="/bites"   element={<EconomicBiteArchivePage />} />
            <Route path="/bite/:id" element={<EconomicBitePage />} />

            {/* ── 성장 영역 (로그인 필요) ── */}
            <Route
              path="/my-growth"
              element={
                <ProtectedRoute>
                  <MyGrowthHubPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
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
            <Route
              path="/dictionary"
              element={
                <ProtectedRoute>
                  <DictionaryPage />
                </ProtectedRoute>
              }
            />

            {/* /profile → /my-growth 로 통합 */}
            <Route path="/profile" element={<Navigate to="/my-growth" replace />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
