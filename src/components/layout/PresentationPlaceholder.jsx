export default function PresentationPlaceholder({ title, cta }) {
  return (
    <div className="ps-page">
      <h1 className="ps-page-title bp-reveal">{title}</h1>
      <p className="ps-page-empty bp-reveal">준비 중이에요.</p>
      {cta && <div className="bp-reveal" style={{ marginTop: 24 }}>{cta}</div>}
    </div>
  );
}
