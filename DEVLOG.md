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

## 2026-06-10 (2차) — 앱 아이콘·브랜딩 확정 + 홈·코치 화면 재설계

### 개요
앱 아이콘과 AI 코치 이미지를 확정했습니다.
ECONOMING의 브랜드 정체성을 "AI 경제 성장 코치"로 정의하고
홈 대시보드와 코치 화면 UI를 전면 개선했습니다.

---

### 1. 앱 아이콘 및 코치 이미지 적용

- `public/icon.jpg` — 앱 아이콘 (초록 식물 + 주황 동전)
- `public/coach.png` — AI 코치 노밍 이미지 (주황 네트워크 구체)
- `index.html` `<link rel="icon" href="%BASE_URL%icon.jpg" />` 로 파비콘 설정
- `TopNav.jsx` 로고: emoji 대신 `<img src="{BASE_URL}icon.jpg">` 실 이미지 사용

**ECONOMING 로고 처리**
- 두 번째 O를 노란 원(`🟡`)으로 교체 → `ECON🟡MING`
- 첫 번째 O는 원래대로 유지 (두 개 변경 시 가독성 저하 확인 후 복원)

### 2. AuthContext 안정화 + ProtectedRoute 개선

**문제**: 페이지 최초 로드 시 `profile`이 잠깐 `null`로 보였다가 채워지는 깜빡임 현상

**원인**: `getSession()` 완료 직후 `setLoading(false)`를 호출했으나, `syncProfile` 비동기 작업이 아직 진행 중이었음

**해결**: `initialize()` async 함수에서 `await syncProfile(u)` 후 `finally { setLoading(false) }`

```js
const initialize = async () => {
  try {
    const { data: { session: sess } } = await supabase.auth.getSession();
    const u = sess?.user ?? null;
    setUser(u); setSession(sess);
    if (u) await syncProfile(u);        // 프로필 동기화 대기
  } catch (e) { console.warn(e.message); }
  finally { if (mounted.current) setLoading(false); }  // 항상 loading 해제
};
```

**ProtectedRoute** 3상태 처리:
- `loading` → CSS 스피너
- `!user` → `/login` 리디렉트
- `user` → 자식 렌더링

### 3. profiles 테이블 email/provider 동기화

- `upsertProfile()` 에 `email`, `provider` 파라미터 추가
- 카카오 로그인 후 닉네임·이메일·아바타가 DB에 올바르게 저장됨을 확인

### 4. 홈 화면 → 사용자 맞춤형 대시보드

- 브랜드 색상 확정: Primary Green `#21C58E`, Noming Yellow `#FFC83D`, Background `#F4FAF6`
- 7단계 성장 아이콘 라인 (현재 단계 강조)
- 노밍 코칭 카드 (노란 그라데이션, coach.png)
- "오늘의 한 걸음" 미션 3개
- 헤로 영역: `{nickname}님의 경제 성장 여정`

**브랜딩 수정 이력**
- `경제 정원` → `경제 성장 여정` 으로 전면 교체 (ECONOMING은 정원 서비스가 아님)
- 홈에 남아 있던 🤖 이모지를 coach.png 이미지로 교체

### 5. 코치 화면 (/coach) — 노밍 브랜딩 적용

- 헤더: coach.png + 온라인 점 + `☀️ 노밍` + `AI 경제 코치` 배지
- 빈 상태: 노밍 인사 카드 + 추천 질문 2×2 그리드
- 채팅 버블: 사용자(초록 우측) / 노밍(흰 좌측 + 아바타)
- 로딩: 도트 바운스 애니메이션
- 자동 리사이즈 textarea, Shift+Enter 줄바꿈

---

## 2026-06-11 — XP 시스템 + 온보딩 + 코치 UX + 대화 저장

### 개요
ECONOMING의 핵심 기능 4가지를 연속으로 구현했습니다.

1. **XP/레벨 시스템** — 7단계 성장 단계 + 진행률 바
2. **경제 수준·성장 단계 분리** — 핵심 설계 변경
3. **온보딩 플로우** — 4단계 노밍 설문
4. **코치 UX 개선 + 대화 저장** — OpenAI 연결 준비 완료

---

### 1. XP/레벨 시스템 (`src/data/levelData.js`)

7단계 성장 단계 정의:

| 단계 | key | 이모지 | 필요 XP |
|------|-----|--------|---------|
| 씨앗 | seed | 🌱 | 0 |
| 새싹 | sprout | 🌿 | 20 |
| 잎 | leaf | 🍃 | 50 |
| 꽃 | flower | 🌸 | 100 |
| 열매 | fruit | 🍊 | 180 |
| 나무 | tree | 🌳 | 300 |
| 숲 | forest | 🌲 | 500 |

**유틸리티 함수**
- `getLevelByXp(xp)` — XP 값으로 현재 단계 반환
- `getNextLevelInfo(xp)` — 다음 단계까지 진행률 계산 (`xpProgress`, `xpTotal`, `xpNeeded`, `progressPercent`)

**profileService.js — `addXp(userId, amount)`**
- 현재 XP 조회 → `newXp` 계산 → `getLevelByXp` 로 레벨 갱신 → Supabase UPDATE
- 온보딩에서 절대 호출하지 않음

**홈 화면 XP 카드**
- 현재 단계 이모지 + 이름 + 총 XP
- 다음 단계 배지 (최고 단계 시 `✨ 최고 단계 달성!`)
- 그린 그라데이션 진행률 바 (트랜지션 애니메이션)
- 7단계 아이콘 라인 (완료 단계 연두 배경, 현재 단계 초록 강조 + 글로우)
- 개발 테스트용 `⚡ +5 XP 테스트` 버튼 (클릭 시 DB 저장 + 즉시 UI 반영)

**Supabase 스키마 변경**
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_level_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_level_check
  CHECK (level IN ('seed', 'sprout', 'leaf', 'flower', 'fruit', 'tree', 'forest'));
-- 트리거: INSERT 시 level='seed', xp=0 고정
```

---

### 2. 경제 수준 ≠ 성장 단계 (핵심 설계 변경)

**철학**: "누구나 같은 출발선에서 성장한다"

| 개념 | 필드 | 설명 |
|------|------|------|
| 성장 단계 | `level`, `xp` | ECONOMING 앱 내 활동 진행도 |
| 경제 수준 | `economic_level` | 사용자의 기존 경제 지식 |

투자 5년차 고급자도 ECONOMING 첫 가입 시 `level=seed, xp=0` 에서 시작합니다.

**profiles 테이블 신규 컬럼**
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS economic_level        TEXT;  -- beginner/intermediate/advanced
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_experience TEXT;  -- none/etf/stock
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation            TEXT;  -- student/employee/freelancer/business
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests             TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed  BOOLEAN DEFAULT FALSE;
```

**홈 화면 표시**
- 성장 단계(🌱 씨앗)와 경제 수준 배지(초급자/중급자/고급자)를 나란히 표시
- 온보딩 미완료 시 `경제 수준 미설정` (점선 배지) + `온보딩 시작 →` 버튼
- 관심 분야가 있으면 태그 형태로 표시

---

### 3. 온보딩 플로우 (`/onboarding`)

**특징**: 딱딱한 설문지 대신 노밍이 친근하게 질문하는 카드 선택형 UI

| 단계 | 질문 | 저장 필드 |
|------|------|---------|
| Step 1 | 경제 공부 경험 | `economic_level` |
| Step 2 | 투자 경험 | `investment_experience` |
| Step 3 | 현재 상황 | `occupation` |
| Step 4 | 관심 분야 (복수) | `interests[]` |

**UX 구현**
- 각 단계마다 노밍 말풍선이 친근한 안내 문구 표시
- 카드 선택 시 초록 체크 + 배경 강조, Step 4는 복수 선택(토글)
- 진행 바(1/4 → 4/4) + 뒤로 가기 버튼
- 완료 화면: 입력 요약 카드 → 저장 버튼

**리디렉트 로직**
- 미인증 사용자 → `/login`
- `onboarding_completed=true` 사용자 → `/home` (중복 온보딩 방지)
- `나중에 설정하기` 버튼으로 스킵 가능

**`saveOnboardingData()` 규칙**
- `level`, `xp` 는 절대 변경하지 않음
- 온보딩 결과만 저장 (`economic_level`, `investment_experience`, `occupation`, `interests`, `onboarding_completed: true`)

---

### 4. 코치 UX 전면 개선 (`/coach`)

**목표**: "뭘 물어볼까?" → "한 번 물어보고 싶다"는 느낌

**빈 상태 (Empty State)**
- 노밍 인사 카드 (옐로우 그라데이션 + 온라인 점)
- 5개 추천 질문 리스트 (클릭 시 즉시 전송, 호버 시 슬라이드 효과)

**노밍 응답 카드 (3단 구조)**
```
💡 노밍의 한 줄 조언      — 옐로우 배경 강조
📚 먼저 알아두면 좋은 것  — 번호 리스트
➡️ 다음에 공부하면 좋은 것 — 그린 칩
```

**로딩 상태**
- `☀️ 노밍이 답변을 준비하고 있어요...` + 3개 도트 바운스

**입력 영역**
- 빠른 주제 칩: 월급 관리 · 저축 · 투자 입문 · 경제 공부 · ETF
- 선택 시 칩 강조 → 텍스트 필드 포커스 이동
- `새 대화` 버튼 (채팅 중 표시)

---

### 5. AI 코치 대화 저장 시스템

**서비스 계층 분리**

```
services/
 ├─ coachService.js         ← AI 응답 전담 (OpenAI 교체 포인트)
 ├─ conversationService.js  ← DB 저장 전담
 ├─ profileService.js       ← 프로필·XP 관리
 └─ aiService.js            ← explainTerm / suggestNextTopic
```

**`coachService.js` — `getCoachResponse(question)`**
- 반환: `{ success, answer, structured: { advice, knowFirst, nextStep } }`
- `answer`: DB 저장용 텍스트 전문
- `structured`: UI 렌더링용 구조화 데이터
- OpenAI 연결 시 이 함수 내부 블록만 교체

**`conversationService.js`**
- `createConversation({ userId, question, answer })` — INSERT
- `getConversations(userId)` — 전체 조회 (최신순)
- `getRecentConversations(userId, limit=5)` — 최근 N개

**Supabase 테이블**
```sql
CREATE TABLE IF NOT EXISTS public.coach_conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS: SELECT/INSERT 본인 대화만
```

**CoachPage 연결**
- 질문 전송 → `getCoachResponse()` → UI 렌더링 → `createConversation()` (fire-and-forget)
- 미인증 사용자는 저장 없이 UI만 동작

---

### 현재 배포 현황

| 항목 | 값 |
|---|---|
| 서비스 URL | https://namong118.github.io/economing/ |
| 레포지토리 | https://github.com/namong118/economing |
| 배포 브랜치 | `gh-pages` (자동: `npm run deploy`) |
| Supabase 프로젝트 | https://ioqkbsurlrgxwyhlqrsf.supabase.co |

---

### Supabase SQL 실행 필요 항목

다음 내용이 `supabase/schema.sql`에 추가됐으나 아직 실제 DB에 적용되지 않았다면 실행 필요:

- `xp INTEGER DEFAULT 0` 컬럼
- `level` CHECK 제약 7단계로 갱신
- `economic_level`, `investment_experience`, `occupation`, `interests[]`, `onboarding_completed` 컬럼
- `coach_conversations` 테이블 + RLS

---

### 다음 작업 예정

- [ ] **OpenAI API 연동** — `coachService.js`의 `getCoachResponse()` 내부 교체
- [ ] 온보딩 완료 후 자동 `/onboarding` 안내 (신규 가입자 플로우)
- [ ] 경제 일기 CRUD (`/diary`)
- [ ] 경제 사전 CRUD (`/dictionary`)
- [ ] 대화 히스토리 UI (코치 화면에서 이전 대화 불러오기)
