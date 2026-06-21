import { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, Bean, Sprout, Leaf, Flower2, Cherry, TreeDeciduous, Trees, Sun } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

const STAGES = [
  { Icon: Bean,          name: '씨앗' },
  { Icon: Sprout,        name: '새싹' },
  { Icon: Leaf,          name: '잎'   },
  { Icon: Flower2,       name: '꽃'   },
  { Icon: Cherry,        name: '열매' },
  { Icon: TreeDeciduous, name: '나무' },
  { Icon: Trees,         name: '숲'   },
];

const PHRASES = ['경제를 쉽게,', '성장을 즐겁게,', '매일 한 잎씩.'];

function useCountUp(target, dur = 1600) {
  const [n, setN] = useState(0);
  const prevRef = useRef(0);
  useEffect(() => {
    const from = prevRef.current;
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
      else prevRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return n;
}

export default function BrandPanel() {
  const navigate = useNavigate();
  const [txt, setTxt] = useState('');
  const panelRef = useRef(null);

  const [learnerTarget, setLearnerTarget] = useState(12480);
  const [leavesTarget,  setLeavesTarget]  = useState(327);
  const learners = useCountUp(learnerTarget);
  const leaves   = useCountUp(leavesTarget);

  const [mouse, setMouse] = useState({ x: 0, y: 0, on: false });

  /* 타이핑 */
  useEffect(() => {
    let pi = 0, ci = 0, del = false, timer;
    const tick = () => {
      const w = PHRASES[pi];
      setTxt(w.slice(0, ci));
      if (!del) {
        ci++;
        if (ci > w.length) { del = true; timer = setTimeout(tick, 1300); return; }
      } else {
        ci--;
        if (ci < 0) { del = false; ci = 0; pi = (pi + 1) % PHRASES.length; }
      }
      timer = setTimeout(tick, del ? 45 : 90);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  /* 스태거 */
  useEffect(() => {
    if (!panelRef.current) return;
    const els = Array.from(panelRef.current.querySelectorAll('.bp-reveal'));
    els.forEach((el, i) => setTimeout(() => el.classList.add('bp-visible'), 60 + i * 100));
  }, []);

  /* 카운터 실시간 틱 */
  useEffect(() => {
    let timer;
    const tick = () => {
      timer = setTimeout(() => {
        if (Math.random() < 0.7) setLearnerTarget(n => n + 1);
        else setLeavesTarget(n => n + 1);
        tick();
      }, 3000 + Math.random() * 4000);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  const magnetic = (e) => {
    const b = e.currentTarget, r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
  };
  const reset = (e) => { e.currentTarget.style.transform = 'translate(0,0)'; };

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  const onMouseLeave = () => setMouse(m => ({ ...m, on: false }));

  return (
    <aside
      className="ds-brand"
      ref={panelRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* 오로라 블롭 */}
      <span className="bp-blob bp-blob1" />
      <span className="bp-blob bp-blob2" />
      <span className="bp-blob bp-blob3" />
      <span className="bp-blob bp-blob4" />
      <span className="bp-grain" />

      {/* 마우스 spotlight */}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 2,
        transition: 'opacity .3s',
        opacity: mouse.on ? 1 : 0,
        background: `radial-gradient(circle 220px at ${mouse.x}px ${mouse.y}px, rgba(31,190,134,.13), transparent 70%)`,
      }} />

      <div className="bp-inner">
        {/* 앱 아이콘 히어로 */}
        <div className="bp-hero bp-reveal">
          <span className="bp-ring" />
          <img className="bp-app-icon" src={`${BASE}appicon.jpg`} alt="ECONOMING" />
        </div>

        {/* 타이핑 태그라인 */}
        <div className="bp-type-line bp-reveal">
          <span>{txt}</span><span className="bp-caret" />
        </div>

        {/* 노밍 소개 */}
        <div className="bp-reveal" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 26 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#FFF6DC', border: '1px solid #FAD98A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sun size={26} color="#F59E0B" />
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 600, color: '#54635C', margin: 0 }}>
            AI 경제 코치 <b style={{ color: '#0B5D49' }}>노밍</b>과 함께<br />
            하루 한 잎씩 경제를 익혀보세요.
          </p>
        </div>

        {/* 통계 칩 */}
        <div className="bp-reveal" style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
          <div className="bp-card" style={{ flex: 1, padding: '13px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#8A988F', marginBottom: 5 }}>
              <Users size={13} color="#1FBE86" /> 함께 성장 중
            </div>
            <div className="bp-stat-num">{learners.toLocaleString()}<span style={{ fontSize: 13 }}>명</span></div>
          </div>
          <div className="bp-card" style={{ flex: 1, padding: '13px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#8A988F', marginBottom: 5 }}>
              <Sprout size={13} color="#1FBE86" /> 오늘 배운 잎
            </div>
            <div className="bp-stat-num">{leaves}<span style={{ fontSize: 13 }}>개</span></div>
          </div>
        </div>

        {/* 성장 7단계 미니 트랙 */}
        <div className="bp-track bp-reveal" style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#8A988F', marginBottom: 11 }}>지식이 자산처럼, 7단계로 성장</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {STAGES.map((st, i) => (
              <Fragment key={st.name}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <st.Icon size={22} color="#1FBE86" />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#54635C' }}>{st.name}</span>
                </div>
                {i < STAGES.length - 1 && <ChevronRight size={12} color="#8FE3C2" strokeWidth={2.5} />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* QR 카드 */}
        <div className="bp-reveal" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
          <div style={{
            width: 78, height: 78, borderRadius: 14,
            background: '#fff', border: '1px solid #E4ECE7',
            padding: 7, flexShrink: 0,
            boxShadow: '0 4px 14px rgba(8,53,43,.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 26 }}>📱</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#8A988F' }}>곧 제공 예정</span>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#14211C', marginBottom: 3 }}>모바일로 이어서</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#8A988F', lineHeight: 1.5 }}>
              QR을 스캔하면<br />휴대폰에서 바로 학습해요
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="bp-divider" />

        {/* 태그라인 */}
        <div className="bp-reveal" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.4, color: '#0B5D49', marginBottom: 20 }}>
          매일 한 잎, 경제가 자라는 습관<br />
          <span style={{ color: '#1FBE86' }}>Grow your money sense!</span>
        </div>

        {/* 마그네틱 버튼 */}
        <div className="bp-reveal" style={{ display: 'flex', gap: 12 }}>
          <button className="ds-outline" onMouseMove={magnetic} onMouseLeave={reset} onClick={() => navigate('/coach')}>
            <Sun size={16} color="#F59E0B" />
            노밍 만나기
          </button>
          <button className="ds-outline" onMouseMove={magnetic} onMouseLeave={reset} onClick={() => navigate('/bites')}>
            <Leaf size={16} color="#1FBE86" />
            오늘의 한잎
          </button>
        </div>
      </div>
    </aside>
  );
}
