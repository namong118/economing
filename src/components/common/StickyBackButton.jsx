/* 상세 페이지(지표 읽기·경제한잎) 전용 상단 헤더 — 뒤로가기 버튼 하나만 덩그러니
   있으면 나중에 끼워 넣은 것처럼 보여서, "← 목적지" 형태의 한 줄 헤더로 만든다.
   목적지 라벨은 실제로 어디서 왔는지(navigationHistory)를 보고 정하고, 모르면
   "뒤로"로 떨어진다. 옅은 배경 + 하단 경계선으로 콘텐츠와 분리해 sticky일 때
   아래 내용이 비쳐 보이지 않게 한다.
   위치 방식(.detail-back-btn, index.css)은 모바일/데스크톱이 다르다 —
   자세한 이유는 index.css 주석 참고: 모바일은 fixed, 데스크톱(≥769px)은 sticky. */
import { useLocation, useNavigate } from 'react-router-dom';
import { getPreviousLabel } from '../../utils/navigationHistory';

export default function StickyBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const label = getPreviousLabel(location.pathname) ?? '뒤로';

  return (
    <>
      <div className="detail-back-btn-spacer" />
      <div className="detail-back-btn">
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '10px 16px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', padding: 0,
              fontSize: 13, fontWeight: 700, color: 'var(--c-forest-700)', cursor: 'pointer',
            }}
          >
            ← {label}
          </button>
        </div>
      </div>
    </>
  );
}
