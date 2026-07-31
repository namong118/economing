// 모든 Edge Function이 동일하게 쓰는 CORS 헤더 — 함수마다 중복 정의하지 않고 여기서 가져온다.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
