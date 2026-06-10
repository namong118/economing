/**
 * Supabase 클라이언트 설정 파일
 *
 * 이 파일은 앱 전체에서 Supabase와 통신할 때 사용하는 "전화기" 역할을 합니다.
 * 딱 한 번 만들고, 모든 서비스 파일에서 이 클라이언트를 import해서 사용합니다.
 *
 * 사용 방법:
 *   import { supabase } from './supabaseClient';
 */

import { createClient } from '@supabase/supabase-js';

// .env.local 파일에서 환경변수 읽기 (Vite는 VITE_ 접두사 필요)
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경변수가 설정되지 않은 경우 경고 출력
if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn(
    '⚠️  Supabase 환경변수가 설정되지 않았습니다.\n' +
    '.env.local 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 입력해주세요.'
  );
}

// Supabase 클라이언트 생성 (싱글턴 - 앱에서 딱 하나만 존재)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    // 브라우저 새로고침 후에도 로그인 유지
    persistSession: true,
    // localStorage에 세션 저장
    storage: window.localStorage,
  },
});
