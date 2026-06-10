-- ================================================================
--  ECONOMING — Supabase DB 스키마
--
--  사용 방법:
--    1. Supabase 대시보드 → SQL Editor
--    2. 아래 SQL을 전체 복사해서 붙여넣고 실행 (Run)
--
--  테이블 목록:
--    profiles         : 사용자 프로필 (레벨, 닉네임, 연속 학습일)
--    vocabulary       : 나만의 경제 사전 (저장한 용어들)
--    diaries          : 경제 일기
--    roadmap_progress : 학습 로드맵 진행 상태
-- ================================================================


-- ────────────────────────────────────────────────────────────────
-- 1. profiles 테이블
--    auth.users와 1:1로 연결됩니다.
--    회원가입 시 트리거가 자동으로 행을 생성합니다.
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname         TEXT,
  avatar_url       TEXT,
  level            TEXT        DEFAULT 'beginner'
                               CHECK (level IN ('beginner', 'elementary', 'intermediate')),
  current_step     INTEGER     DEFAULT 1,
  streak_days      INTEGER     DEFAULT 0,
  last_active_date DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 이미 테이블이 있는 경우 avatar_url 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

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

-- 인덱스: user_id 기준 빠른 조회
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);

-- ────────────────────────────────────────────────────────────────
-- 3. diaries 테이블 (경제 일기)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diaries (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title          TEXT        NOT NULL,
  content        TEXT        NOT NULL,
  mood           TEXT        DEFAULT '😊',
  learned_terms  TEXT[]      DEFAULT '{}',  -- 배열 타입 (여러 용어 저장)
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
  UNIQUE(user_id, step)   -- 같은 사용자가 같은 스텝을 중복 저장 불가
);

CREATE INDEX IF NOT EXISTS idx_roadmap_user_id ON roadmap_progress(user_id);


-- ================================================================
--  RLS (Row Level Security) 정책
--
--  RLS란: "자기 데이터만 볼 수 있도록" 행 단위 보안을 설정합니다.
--  예: A 사용자는 B 사용자의 일기를 조회할 수 없습니다.
-- ================================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 프로필만 조회 가능" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필만 수정 가능" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "본인 프로필만 생성 가능" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- vocabulary
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 용어만 조회" ON vocabulary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 용어만 저장" ON vocabulary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 용어만 삭제" ON vocabulary
  FOR DELETE USING (auth.uid() = user_id);


-- diaries
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 일기만 조회" ON diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 일기만 저장" ON diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 일기만 삭제" ON diaries
  FOR DELETE USING (auth.uid() = user_id);


-- roadmap_progress
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 진행도만 조회" ON roadmap_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 진행도만 저장" ON roadmap_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 진행도만 수정" ON roadmap_progress
  FOR UPDATE USING (auth.uid() = user_id);


-- ================================================================
--  트리거: 회원가입 시 profiles 행 자동 생성
--
--  사용자가 회원가입하면 auth.users에 행이 생깁니다.
--  이 트리거가 그 직후 profiles 테이블에도 자동으로 행을 만듭니다.
-- ================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'nickname',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있으면 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
