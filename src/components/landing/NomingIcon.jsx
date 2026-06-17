export default function NomingIcon({ size = 80 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}noming.png`}
      alt="노밍"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  );
}
