import nomingIconSrc from '../../assets/noming-icon.png';

export default function NomingIcon({ size = 80 }) {
  return (
    <img
      src={nomingIconSrc}
      alt="ECONOMING"
      width={size}
      height={size}
      style={{ borderRadius: `${Math.round(size * 0.225)}px`, display: 'block' }}
    />
  );
}
