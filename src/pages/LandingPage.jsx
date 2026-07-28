import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import ValueSection from '../components/landing/ValueSection';
import FeatureSection from '../components/landing/FeatureSection';
import GrowthFlowSection from '../components/landing/GrowthFlowSection';
import AppPreviewSection from '../components/landing/AppPreviewSection';
import ComingSoonSection from '../components/landing/ComingSoonSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';
import Reveal from '../components/landing/Reveal';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--c-canvas)',
      }}>
        <Loader2 size={32} color="var(--c-green-500)" style={{ animation: 'spin 1.2s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', overflowX: 'hidden' }}>
      <LandingNav />
      <Reveal><HeroSection /></Reveal>
      <Reveal><ProblemSection /></Reveal>
      <Reveal><ValueSection /></Reveal>
      <Reveal><FeatureSection /></Reveal>
      <Reveal><GrowthFlowSection /></Reveal>
      <Reveal><AppPreviewSection /></Reveal>
      <Reveal><ComingSoonSection /></Reveal>
      <Reveal><FinalCTASection /></Reveal>
      <LandingFooter />
    </div>
  );
}
