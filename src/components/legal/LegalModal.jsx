import PrivacyPolicyContent from './PrivacyPolicyContent';
import TermsContent from './TermsContent';
import { X } from 'lucide-react';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto', borderRadius: '20px 20px 0 0', padding: '20px 24px 40px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'sticky', top: 0, float: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={20} />
        </button>
        <div style={{ clear: 'both' }}>
          {type === 'privacy' ? <PrivacyPolicyContent /> : <TermsContent />}
        </div>
      </div>
    </div>
  );
}
