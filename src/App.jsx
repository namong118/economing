import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DictionaryProvider } from './context/DictionaryContext';
import ProtectedRoute  from './components/common/ProtectedRoute';
import AppShell        from './components/layout/AppShell';
import PresentationShell from './components/layout/PresentationShell';
import LandingPage     from './pages/LandingPage';
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
import EconomicBiteArchivePage      from './pages/EconomicBiteArchivePage';
import IndependenceDiagnosisPage    from './pages/IndependenceDiagnosisPage';
import IndicatorPage                from './pages/IndicatorPage';

// 발표용 페이지(about/profile-intro/guide/tech)와 한잎 상세(인포그래픽 데이터 포함)는
// 일반 사용 흐름에서 자주 안 쓰이거나 전용 레이아웃이라, 메인 번들에서 분리해 지연 로드한다.
const AboutPage        = lazy(() => import('./pages/AboutPage'));
const ProfileIntroPage = lazy(() => import('./pages/ProfileIntroPage'));
const GuidePage        = lazy(() => import('./pages/GuidePage'));
const TechStackPage    = lazy(() => import('./pages/TechStackPage'));
const EconomicBitePage = lazy(() => import('./pages/EconomicBitePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage         = lazy(() => import('./pages/TermsPage'));

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

            {/* 법적 문서: 회원가입(모바일 포함) 흐름에서 링크로 연결되므로
                PresentationShell(1024px 미만 /home 리다이렉트)에 묶지 않고
                화면 크기와 무관하게 항상 접근 가능한 독립 레이아웃으로 둔다 */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms"   element={<TermsPage />} />

          </Routes>
        </DictionaryProvider>
      </AuthProvider>
    </Router>
  );
}
