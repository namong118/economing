-- ================================================================
--  ECONOMING — Supabase DB 스키마
--
--  사용 방법:
--    1. Supabase 대시보드 → SQL Editor
--    2. 아래 SQL을 전체 복사해서 붙여넣고 실행 (Run)
--
--  보안 원칙:
--    - 모든 사용자 데이터 테이블에 RLS 활성화
--    - 정책 기준: auth.uid() = user_id  (자기 데이터만 접근)
--    - service_role key는 프론트엔드에 절대 노출 금지
--    - anon key는 RLS로 보호되므로 클라이언트에 노출 허용
--
--  테이블 목록:
--    profiles            : 사용자 프로필 (레벨, 닉네임, 연속 학습일)
--    vocabulary          : 나만의 경제 사전 (저장한 용어들)
--    diaries             : 경제 일기 (레거시 — economic_journals로 대체 예정)
--    roadmap_progress    : 학습 로드맵 진행 상태
--    coach_conversations : AI 코치 대화 내역
--    reading_contents    : 오늘의 경제 읽기 콘텐츠 (공개 읽기 전용)
--    reading_logs        : 사용자 읽기 완료 기록 및 XP 지급 이력
--    economic_journals   : 개인 경제 성장 저널 (6섹션 구조화)
-- ================================================================


-- ────────────────────────────────────────────────────────────────
-- 1. profiles 테이블
--    auth.users와 1:1로 연결됩니다.
--    회원가입 시 트리거가 자동으로 행을 생성합니다.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                     UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                  TEXT,
  nickname               TEXT,
  avatar_url             TEXT,
  provider               TEXT,
  -- ── 성장 단계 (ECONOMING 앱 내 활동 진행도) ──────────────────────
  level                  TEXT        DEFAULT 'seed',   -- seed/sprout/leaf/flower/fruit/tree/forest
  xp                     INTEGER     DEFAULT 0,
  -- ── 경제 수준 (사용자 기존 경제 지식 — 온보딩에서 설정) ──────────
  economic_level         TEXT,                         -- beginner/intermediate/advanced  (NULL = 온보딩 미완료)
  investment_experience  TEXT,                         -- 투자 경험 (none/etf/stock)
  occupation             TEXT,                         -- 직업
  interests              TEXT[]      DEFAULT '{}',     -- 관심 분야 (복수 선택)
  -- ──────────────────────────────────────────────────────────────────
  onboarding_completed   BOOLEAN     DEFAULT FALSE,
  current_step           INTEGER     DEFAULT 1,
  streak_days            INTEGER     DEFAULT 0,
  last_active_date       DATE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- 기존 테이블에 컬럼 추가 (없는 경우에만)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url            TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email                 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider              TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp                    INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS economic_level        TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_experience TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation            TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests             TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed  BOOLEAN DEFAULT FALSE;

-- 레벨 컬럼: 기존 CHECK 제약 제거 후 새 단계 시스템으로 마이그레이션
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_level_check;
ALTER TABLE profiles ALTER COLUMN level SET DEFAULT 'seed';

-- 기존 legacy 레벨 값 → 새 단계로 변환
UPDATE profiles SET level = 'seed'   WHERE level = 'beginner';
UPDATE profiles SET level = 'sprout' WHERE level = 'elementary';
UPDATE profiles SET level = 'leaf'   WHERE level = 'intermediate';

-- 새 CHECK 제약 추가
ALTER TABLE profiles ADD CONSTRAINT profiles_level_check
  CHECK (level IN ('seed', 'sprout', 'leaf', 'flower', 'fruit', 'tree', 'forest'));


-- ────────────────────────────────────────────────────────────────
-- 2. vocabulary 테이블 (나만의 경제 사전)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  term        TEXT        NOT NULL,
  full_name   TEXT,
  explanation TEXT,
  emoji       TEXT        DEFAULT '📖',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);


-- ────────────────────────────────────────────────────────────────
-- 3. diaries 테이블 (경제 일기 — 레거시)
--    새 기능은 economic_journals 테이블을 사용합니다.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diaries (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title          TEXT        NOT NULL,
  content        TEXT        NOT NULL,
  mood           TEXT        DEFAULT '😊',
  learned_terms  TEXT[]      DEFAULT '{}',
  ai_suggestion  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);


-- ────────────────────────────────────────────────────────────────
-- 4. roadmap_progress 테이블 (학습 로드맵 진행도)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step         INTEGER     NOT NULL CHECK (step >= 1 AND step <= 5),
  completed    BOOLEAN     DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, step)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_user_id ON roadmap_progress(user_id);


-- ────────────────────────────────────────────────────────────────
-- 5. coach_conversations 테이블 (노밍 대화 기록)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coach_conversations (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question   TEXT        NOT NULL,
  answer     TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id
  ON coach_conversations(user_id, created_at DESC);


-- ────────────────────────────────────────────────────────────────
-- reading_contents 테이블
--   오늘의 경제 읽기 콘텐츠 (관리자가 Supabase 대시보드에서 직접 등록)
--   SELECT는 비인증 사용자도 가능, INSERT/UPDATE/DELETE는 service_role만 가능
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reading_contents (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  category       TEXT        NOT NULL,
  intro          TEXT,
  content        TEXT        NOT NULL,
  summary        TEXT[]      DEFAULT '{}',
  keywords       JSONB       DEFAULT '[]',
  noming_comment TEXT,
  reading_time   INTEGER     DEFAULT 3,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ────────────────────────────────────────────────────────────────
-- reading_logs 테이블
--   사용자별 읽기 완료 기록 및 XP 지급 이력
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reading_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id  UUID        NOT NULL REFERENCES public.reading_contents(id) ON DELETE CASCADE,
  xp_granted  INTEGER     DEFAULT 5,
  read_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ────────────────────────────────────────────────────────────────
-- economic_journals 테이블
--   개인 경제 성장 저널 — 6개 섹션 구조화 입력
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.economic_journals (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journal_date     DATE        DEFAULT current_date,
  learned_today    TEXT,
  news_title       TEXT,
  news_thought     TEXT,
  questions        TEXT,
  consumption_note TEXT,
  next_topic       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.economic_journals
  ADD COLUMN IF NOT EXISTS journal_date DATE DEFAULT current_date;

CREATE INDEX IF NOT EXISTS idx_economic_journals_user_id
  ON public.economic_journals(user_id, created_at DESC);


-- ================================================================
--  RLS (Row Level Security) 정책
--
--  원칙: "사용자는 자신의 데이터만 접근 가능"
--  기준: auth.uid() = user_id  (또는 profiles의 경우 auth.uid() = id)
--
--  무한 재귀 위험 없음:
--    모든 정책이 auth.uid() 직접 비교 방식 사용
--    같은 테이블을 서브쿼리로 참조하는 정책 없음
--
--  RLS가 활성화된 테이블에서 정책이 없는 오퍼레이션은 기본 거부(DENY)됩니다.
-- ================================================================


-- ────────────────────────────────────────────────────────────────
-- profiles RLS
--   - SELECT/UPDATE/INSERT: 본인 행만
--   - DELETE: 정책 없음 (auth.users CASCADE DELETE로 처리 — 직접 삭제 불필요)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 프로필만 조회 가능" ON profiles;
DROP POLICY IF EXISTS "본인 프로필만 수정 가능" ON profiles;
DROP POLICY IF EXISTS "본인 프로필만 생성 가능" ON profiles;

CREATE POLICY "본인 프로필만 조회 가능" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필만 수정 가능" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "본인 프로필만 생성 가능" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ────────────────────────────────────────────────────────────────
-- vocabulary RLS
--   - SELECT/INSERT/UPDATE/DELETE: 본인 용어만
-- ────────────────────────────────────────────────────────────────
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 용어만 조회" ON vocabulary;
DROP POLICY IF EXISTS "본인 용어만 저장" ON vocabulary;
DROP POLICY IF EXISTS "본인 용어만 수정" ON vocabulary;
DROP POLICY IF EXISTS "본인 용어만 삭제" ON vocabulary;

CREATE POLICY "본인 용어만 조회" ON vocabulary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 용어만 저장" ON vocabulary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 용어만 수정" ON vocabulary
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 용어만 삭제" ON vocabulary
  FOR DELETE USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────────
-- diaries RLS (레거시 테이블)
--   - SELECT/INSERT/DELETE: 본인 일기만
--   - UPDATE: 정책 없음 (레거시 테이블은 수정 기능 미사용)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 일기만 조회" ON diaries;
DROP POLICY IF EXISTS "본인 일기만 저장" ON diaries;
DROP POLICY IF EXISTS "본인 일기만 삭제" ON diaries;

CREATE POLICY "본인 일기만 조회" ON diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 일기만 저장" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 일기만 삭제" ON diaries
  FOR DELETE USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────────
-- roadmap_progress RLS
--   - SELECT/INSERT/UPDATE/DELETE: 본인 진행도만
-- ────────────────────────────────────────────────────────────────
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 진행도만 조회" ON roadmap_progress;
DROP POLICY IF EXISTS "본인 진행도만 저장" ON roadmap_progress;
DROP POLICY IF EXISTS "본인 진행도만 수정" ON roadmap_progress;
DROP POLICY IF EXISTS "본인 진행도만 삭제" ON roadmap_progress;

CREATE POLICY "본인 진행도만 조회" ON roadmap_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 진행도만 저장" ON roadmap_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 진행도만 수정" ON roadmap_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 진행도만 삭제" ON roadmap_progress
  FOR DELETE USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────────
-- coach_conversations RLS
--   - SELECT/INSERT/DELETE: 본인 대화만
--   - UPDATE: 정책 없음 (대화 기록은 수정 불필요)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 대화만 조회" ON coach_conversations;
DROP POLICY IF EXISTS "본인 대화만 저장" ON coach_conversations;
DROP POLICY IF EXISTS "본인 대화만 삭제" ON coach_conversations;

CREATE POLICY "본인 대화만 조회" ON coach_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 대화만 저장" ON coach_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 대화만 삭제" ON coach_conversations
  FOR DELETE USING (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────────
-- reading_contents RLS
--   - SELECT: 비인증 사용자 포함 누구나 읽기 가능 (공개 콘텐츠)
--   - INSERT/UPDATE/DELETE: 정책 없음 → 기본 거부 (service_role로만 가능)
--     관리자는 Supabase 대시보드 또는 service_role key로 직접 관리
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.reading_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "누구나 읽기 콘텐츠 조회" ON public.reading_contents;

CREATE POLICY "누구나 읽기 콘텐츠 조회"
  ON public.reading_contents FOR SELECT
  USING (true);


-- ────────────────────────────────────────────────────────────────
-- reading_logs RLS
--   - SELECT/INSERT: 본인 기록만
--   - UPDATE/DELETE: 정책 없음 (읽기 기록은 수정/삭제 불필요)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.reading_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 읽기 로그 조회" ON public.reading_logs;
DROP POLICY IF EXISTS "본인 읽기 로그 등록" ON public.reading_logs;

CREATE POLICY "본인 읽기 로그 조회"
  ON public.reading_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 읽기 로그 등록"
  ON public.reading_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────────
-- economic_journals RLS
--   - SELECT/INSERT/UPDATE/DELETE: 본인 저널만
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.economic_journals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 저널 조회" ON public.economic_journals;
DROP POLICY IF EXISTS "본인 저널 등록" ON public.economic_journals;
DROP POLICY IF EXISTS "본인 저널 수정" ON public.economic_journals;
DROP POLICY IF EXISTS "본인 저널 삭제" ON public.economic_journals;

CREATE POLICY "본인 저널 조회"
  ON public.economic_journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 저널 등록"
  ON public.economic_journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 저널 수정"
  ON public.economic_journals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인 저널 삭제"
  ON public.economic_journals FOR DELETE
  USING (auth.uid() = user_id);


-- ================================================================
--  트리거: 회원가입 시 profiles 행 자동 생성
--
--  SECURITY DEFINER: 함수 소유자(postgres) 권한으로 실행
--  이유: 회원가입 시점에 auth.uid()가 아직 설정되지 않아
--        RLS INSERT 정책을 통과할 수 없기 때문 — 의도된 예외
-- ================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, avatar_url, provider, level, xp)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'profile_image_url'
    ),
    NEW.raw_app_meta_data->>'provider',
    'seed',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ================================================================
--  향후 확장 테이블 템플릿
--
--  user_dictionary, learning_roadmaps 등 새 테이블 추가 시
--  아래 패턴을 그대로 복사해서 사용하세요.
-- ================================================================

/*
-- ── [새 테이블명] ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.[테이블명] (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- ... 필드 추가 ...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_[테이블명]_user_id ON public.[테이블명](user_id);

ALTER TABLE public.[테이블명] ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 [명칭]만 조회" ON public.[테이블명];
DROP POLICY IF EXISTS "본인 [명칭]만 저장" ON public.[테이블명];
DROP POLICY IF EXISTS "본인 [명칭]만 수정" ON public.[테이블명];
DROP POLICY IF EXISTS "본인 [명칭]만 삭제" ON public.[테이블명];

CREATE POLICY "본인 [명칭]만 조회" ON public.[테이블명]
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 [명칭]만 저장" ON public.[테이블명]
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 [명칭]만 수정" ON public.[테이블명]
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 [명칭]만 삭제" ON public.[테이블명]
  FOR DELETE USING (auth.uid() = user_id);
*/
