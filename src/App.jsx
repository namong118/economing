import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DictionaryProvider } from './context/DictionaryContext';
import ProtectedRoute  from './components/common/ProtectedRoute';
import AppShell        from './components/layout/AppShell';
import PresentationShell from './components/layout/PresentationShell';
import LandingPage     from './pages/LandingPage';
import AboutPage        from './pages/AboutPage';
import ProfileIntroPage from './pages/ProfileIntroPage';
import GuidePage        from './pages/GuidePage';
import TechStackPage    from './pages/TechStackPage';
import DiagnosisPage   from './pages/DiagnosisPage';
import ResultPage      from './pages/ResultPage';
import HomePage        from './pages/HomePage';
import CoachPage       from './pages/CoachPage';
import DiaryPage       from './pages/DiaryPage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import OnboardingPage  from './pages/OnboardingPage';
import ReadingPage     from './pages/ReadingPage';
import MyGrowthHubPage       from './pages/MyGrowthHubPage';
import EconomicBitePage      from './pages/EconomicBitePage';
import EconomicBiteArchivePage      from './pages/EconomicBiteArchivePage';
import IndependenceDiagnosisPage    from './pages/IndependenceDiagnosisPage';
import IndicatorPage                from './pages/IndicatorPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DictionaryProvider>
          <Routes>

            {/* 랜딩: 풀스크린, AppShell 없음 */}
            <Route path="/" element={<LandingPage />} />

            {/* 앱 전체: AppShell 레이아웃 */}
            <Route element={<AppShell />}>
              <Route path="/login"      element={<LoginPage />} />
              <Route path="/signup"     element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              <Route path="/diagnosis"    element={<DiagnosisPage />} />
              <Route path="/independence" element={<IndependenceDiagnosisPage />} />
              <Route path="/result"     element={<ResultPage />} />

              <Route path="/home"       element={<HomePage />} />
              <Route path="/coach"      element={<CoachPage />} />
              <Route path="/read"       element={<ReadingPage />} />
              <Route path="/bites"      element={<EconomicBiteArchivePage />} />
              <Route path="/bite/:id"   element={<EconomicBitePage />} />
              <Route path="/indicator/:id" element={<IndicatorPage />} />

              <Route path="/my-growth" element={<ProtectedRoute><MyGrowthHubPage /></ProtectedRoute>} />
              <Route path="/diary"     element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />

              <Route path="/profile" element={<Navigate to="/my-growth" replace />} />
              <Route path="*"        element={<Navigate to="/home" replace />} />
            </Route>

            {/* 발표용 페이지: PresentationShell 레이아웃 (AppShell과 별개) */}
            <Route element={<PresentationShell />}>
              <Route path="/about"         element={<AboutPage />} />
              <Route path="/profile-intro" element={<ProfileIntroPage />} />
              <Route path="/guide"         element={<GuidePage />} />
              <Route path="/tech"          element={<TechStackPage />} />
            </Route>

          </Routes>
        </DictionaryProvider>
      </AuthProvider>
    </Router>
  );
}
