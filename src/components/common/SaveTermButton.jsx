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
        background:     saved ? '#F0FDF4' : '#FAFBFC',
        border:         `1.5px solid ${saved ? '#86EFAC' : '#E2E8F0'}`,
        color:          saved ? '#15803D' : '#64748B',
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
          e.currentTarget.style.background    = '#F0FDF4';
          e.currentTarget.style.borderColor   = '#86EFAC';
          e.currentTarget.style.color         = '#15803D';
        }
      }}
      onMouseLeave={e => {
        if (!saved && !loading) {
          e.currentTarget.style.background    = '#FAFBFC';
          e.currentTarget.style.borderColor   = '#E2E8F0';
          e.currentTarget.style.color         = '#64748B';
        }
      }}
    >
      {saved ? '✓ 저장됨' : loading ? '…' : '＋ 사전 저장'}
    </button>
  );
}
