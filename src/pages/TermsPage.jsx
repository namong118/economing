import { useNavigate } from 'react-router-dom';
import TermsContent from '../components/legal/TermsContent';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
      <button
        onClick={() => navigate('/home')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--c-forest-700)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24, padding: 0 }}
      >
        ← 뒤로가기
      </button>
      <TermsContent />
    </div>
  );
}
