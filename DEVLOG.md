# ECONOMING 개발일지

---

## 2026-06-10 — Supabase Auth 연결 + 카카오 로그인 + GitHub Pages 배포

### 개요
목 인증(MOCK_AUTH)을 제거하고 실제 Supabase 인증으로 전환했습니다.
카카오 소셜 로그인을 붙이고 GitHub Pages에 SPA를 안정적으로 배포하는 과정을 정리합니다.

---

### 1. Supabase 실제 인증 연결

- `VITE_MOCK_AUTH=false` 로 전환
- `AuthContext.jsx` 전면 재작성
  - `supabase.auth.onAuthStateChange` 로 세션 구독
  - `extractNickname`, `extractAvatarUrl` 헬퍼 함수로 OAuth 메타데이터 통일 추출
  - `syncProfile` 으로 로그인 시 profiles 테이블 자동 upsert
  - Context 제공 값: `user`, `session`, `profile`, `userProfile`, `loading`, `signIn`, `signUp`, `signOut`, `refreshProfile`

### 2. Supabase DB 스키마 (`supabase/schema.sql`)

- **profiles** 테이블에 `avatar_url TEXT` 컬럼 추가
- 회원가입 트리거 개선: `COALESCE(name, full_name, nickname, email_prefix)` 로 닉네임 자동 추출, `avatar_url` / `picture` 로 프로필 이미지 자동 저장
- RLS 정책 전체 적용 (`DROP POLICY IF EXISTS` → `CREATE POLICY` 패턴으로 멱등성 확보)
- 테이블: `profiles`, `vocabulary`, `diaries`, `roadmap_progress`

### 3. 카카오 소셜 로그인

**설정 절차**
1. Kakao Developers → 앱 → 카카오 로그인 활성화
2. Redirect URI 등록: `https://<supabase-ref>.supabase.co/auth/v1/callback`
3. 동의항목: `profile_nickname`, `profile_image` 활성화 (이메일은 비즈앱 없이 불가)
4. Supabase Dashboard → Auth → Providers → Kakao 활성화
5. Supabase → Auth → Configuration → "Allow users to sign in without email" 토글 ON
6. Supabase Redirect URLs에 `https://namong118.github.io/economing/` 추가

**코드 (`authService.js`)**
```js
export async function signInWithKakao() {
  return supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: window.location.origin + '/economing/',
      scopes: 'profile_nickname profile_image',
      queryParams: { scope: 'profile_nickname profile_image' },
    },
  });
}
```

**겪은 문제들**
| 에러 | 원인 | 해결 |
|---|---|---|
| KOE205 | Redirect URI를 로그아웃 섹션에 등록 | 로그인 Redirect URI 섹션에 재등록 |
| 동의항목 오류 | `account_email` 스코프를 Supabase가 기본으로 요청 | `queryParams.scope` 오버라이드 + 이메일 없는 로그인 허용 토글 |
| `validation_failed` | Kakao provider 미활성화 | Supabase Dashboard에서 활성화 |

### 4. 내 정보(Profile) 페이지

- `/profile` 경로, ProtectedRoute 적용
- 표시 항목: user.id, 이메일, 로그인 수단, `user_metadata` / `app_metadata` JSON 원문, profiles 테이블 rows (nickname, avatar_url, level, created_at), 프로필 이미지
- 카카오 로그인 후 닉네임·아바타 디버깅 용도로 활용

### 5. GitHub Pages 배포

**설정**
- `vite.config.js`: 빌드 시에만 `base: '/economing/'`, 개발 서버는 `base: '/'`
- `gh-pages` npm 패키지로 `dist/` → `gh-pages` 브랜치 배포
- `public/.nojekyll`: Jekyll이 `_` 접두사 파일을 무시하는 현상 방지

**겪은 문제들**
| 문제 | 원인 | 해결 |
|---|---|---|
| 사이트 빈 화면 | `.nojekyll` 누락으로 Jekyll이 assets 무시 | `public/.nojekyll` 추가 |
| JS 번들 404 | 로컬 빌드 해시와 gh-pages 배포 불일치 | `npm run deploy` 재실행 |
| 카카오 로그인 후 localhost 리다이렉트 | Supabase Site URL이 localhost로 설정됨 | Supabase Redirect URLs에 GitHub Pages URL 추가 |

### 6. GitHub Pages SPA 딥링크 문제 → HashRouter 전환

**문제**: GitHub Pages 프로젝트 페이지(`/economing/`)는 하위 경로 404 시 프로젝트 레벨 `404.html`을 사용하지 않아 딥링크(`/economing/home` 직접 접근)가 불가능했습니다.

**시도 1 — 404.html + index.html 리다이렉트 패턴**
- 404.html이 `?/home` 쿼리 파라미터 방식으로 인코딩 후 index.html에서 복원
- GitHub Pages CDN 캐시 문제 + 프로젝트 페이지 한계로 불안정

**최종 해결 — HashRouter 전환**
```js
// App.jsx
import { HashRouter as Router } from 'react-router-dom';
// basename 제거 — HashRouter는 # 이후만 라우팅하므로 불필요
```

- URL 형태: `https://namong118.github.io/economing/#/home`
- `#` 이후는 서버에 요청되지 않으므로 GitHub Pages 404 원천 차단
- 카카오 OAuth `redirectTo`를 `/economing/` 로 고정 (BASE_URL 환경변수 의존 제거)

---

### 현재 배포 현황

| 항목 | 값 |
|---|---|
| 서비스 URL | https://namong118.github.io/economing/ |
| 레포지토리 | https://github.com/namong118/economing |
| 배포 브랜치 | `gh-pages` (자동: `npm run deploy`) |
| Supabase 프로젝트 | https://ioqkbsurlrgxwyhlqrsf.supabase.co |

---

### 다음 작업 예정

- [ ] OpenAI API 연동 (`aiService.js` TODO 완성)
- [ ] AI 맞춤 학습 로드맵 생성
- [ ] 경제 일기 AI 피드백
- [ ] 경제 용어 사전 AI 검색
- [ ] Supabase schema.sql 실제 적용 확인 (SQL Editor에서 실행)
