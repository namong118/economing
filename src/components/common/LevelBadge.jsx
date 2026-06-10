/* 경제 레벨 뱃지 컴포넌트 */
import { levelInfo } from '../../data/diagnosisQuestions';

export default function LevelBadge({ level, size = 'md', showEmoji = true }) {
  const info = levelInfo[level] || levelInfo.beginner;

  const sizes = {
    sm: { fontSize: '11px', padding: '3px 10px', gap: '3px' },
    md: { fontSize: '13px', padding: '5px 14px', gap: '5px' },
    lg: { fontSize: '15px', padding: '8px 18px', gap: '6px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizes[size].gap,
        background: info.bgColor,
        color: info.color,
        borderRadius: '100px',
        fontWeight: '700',
        fontSize: sizes[size].fontSize,
        padding: sizes[size].padding,
        letterSpacing: '-0.2px',
        whiteSpace: 'nowrap',
      }}
    >
      {showEmoji && <span>{info.emoji}</span>}
      {info.label}
    </span>
  );
}
