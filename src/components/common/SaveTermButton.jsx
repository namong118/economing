import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDictionaryCtx } from '../../context/DictionaryContext';

/**
 * term        — 저장할 용어 (필수)
 * meaning     — 뜻 (선택)
 * sourceType  — 'economic_bite' | 'coach' | 'news'
 * sourceId    — 출처 ID (선택)
 * size        — 'sm' | 'md'
 */
export default function SaveTermButton({
  term,
  meaning    = '',
  sourceType = '',
  sourceId   = '',
  size       = 'sm',
}) {
  const { user } = useAuth();
  const { isSaved, save } = useDictionaryCtx();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const saved = isSaved(term);
  const sm    = size === 'sm';

  async function handleClick(e) {
    e.stopPropagation();
    if (loading || saved) return;
    setLoading(true);
    await save({ term, meaning, sourceType, sourceId });
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={saved ? '이미 내 사전에 저장됐어요' : `"${term}" 내 사전에 저장`}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            sm ? 3 : 4,
        padding:        sm ? '3px 9px' : '6px 13px',
        borderRadius:   100,
        background:     saved ? 'var(--c-green-50)' : '#FAFBFC',
        border:         `1.5px solid ${saved ? 'var(--c-green-300)' : 'var(--c-line)'}`,
        color:          saved ? 'var(--c-forest-700)' : 'var(--c-slate)',
        fontSize:       sm ? 11 : 12,
        fontWeight:     700,
        cursor:         saved ? 'default' : loading ? 'wait' : 'pointer',
        transition:     'all 0.15s',
        letterSpacing:  '-0.1px',
        flexShrink:     0,
        whiteSpace:     'nowrap',
        lineHeight:     1,
      }}
      onMouseEnter={e => {
        if (!saved && !loading) {
          e.currentTarget.style.background    = 'var(--c-green-50)';
          e.currentTarget.style.borderColor   = 'var(--c-green-300)';
          e.currentTarget.style.color         = 'var(--c-forest-700)';
        }
      }}
      onMouseLeave={e => {
        if (!saved && !loading) {
          e.currentTarget.style.background    = '#FAFBFC';
          e.currentTarget.style.borderColor   = 'var(--c-line)';
          e.currentTarget.style.color         = 'var(--c-slate)';
        }
      }}
    >
      {saved ? '✓ 저장됨' : loading ? '…' : '＋ 사전 저장'}
    </button>
  );
}
