/* 지표 상세·한잎 상세의 "← 경제읽기"/"← 홈" 같은 동적 뒤로가기 라벨을 위한
 * 아주 가벼운 방문 경로 기록. React Router는 "이전 경로가 뭐였는지"를 직접
 * 제공하지 않아서, AppShell에서 매 라우트 변경마다 pathname을 여기에 쌓아두고
 * StickyBackButton이 "현재 페이지 직전"이 뭐였는지 조회한다.
 * 새로고침하면 모듈 상태가 초기화되므로(=기록이 없으므로) 그 경우엔
 * 자연스럽게 기본값("뒤로")으로 떨어진다 — 의도된 동작이다. */
const visited = [];

export function recordVisit(pathname) {
  if (visited[visited.length - 1] === pathname) return; // 같은 경로 중복 기록 방지
  visited.push(pathname);
  if (visited.length > 20) visited.shift();
}

const LABEL_BY_PREFIX = [
  { prefix: '/read', label: '경제읽기' },
  { prefix: '/home', label: '홈' },
  { prefix: '/bites', label: '경제 한잎 모음' },
  { prefix: '/my-growth', label: '내 성장' },
];

/* 지금 페이지(currentPathname) 바로 직전에 있던 방문 경로를 알려진 라벨로 변환.
 * 모르는 경로거나 기록이 없으면 null — 호출 쪽에서 "뒤로"로 대체한다. */
export function getPreviousLabel(currentPathname) {
  for (let i = visited.length - 1; i >= 0; i--) {
    if (visited[i] !== currentPathname) {
      const prev = visited[i];
      const match = LABEL_BY_PREFIX.find(({ prefix }) => prev.startsWith(prefix));
      return match?.label ?? null;
    }
  }
  return null;
}
