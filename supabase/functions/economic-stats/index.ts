import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ECOS_KEY  = Deno.env.get('ECOS_API_KEY')
const KOSIS_KEY = Deno.env.get('KOSIS_API_KEY')

// 통계청/한국은행 지표는 월(또는 분기) 단위로만 갱신되므로 매 요청마다 원천 API를
// 호출하지 않고, 같은 함수 인스턴스가 살아있는 동안(warm) 24시간 캐시로 재사용.
// (Edge Function cold start 시엔 초기화되지만, 이 정도로도 호출량은 크게 줄어듦 —
//  일별 갱신되는 실시간 시세가 아니라 월/분기 단위 통계라 정확도 손실 없음)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
let cache: { data: unknown; fetchedAt: number } | null = null

function round2(n: number) {
  return Math.round(n * 100) / 100
}

/* YYYYMM 형식으로 n개월 전 날짜 계산 */
function yyyymm(monthsAgo: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`
}

/* YYYY0Q 형식(예: 2024년 2분기 → "202402")으로 n분기 전 계산 — KOSIS 분기 주기용 (PRD_DE와 동일한 자리수) */
function yyyyq(quartersAgo: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - quartersAgo * 3)
  const q = Math.floor(d.getMonth() / 3) + 1
  return `${d.getFullYear()}${String(q).padStart(2, '0')}`
}

/* YYYYMMDD 형식으로 n일 전 날짜 계산 — 국고채 금리(817Y002)는 일별(D) 주기로만 제공됨 */
function yyyymmdd(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

/* ── ECOS (한국은행) ── */
async function fetchEcosSeries(statCode: string, itemCode: string, cycle: string, start: string, end: string) {
  const url = `https://ecos.bok.or.kr/api/StatisticSearch/${ECOS_KEY}/json/kr/1/100/${statCode}/${cycle}/${start}/${end}/${itemCode}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ECOS 응답 실패 (${res.status})`)

  const json = await res.json()
  if (json?.RESULT) throw new Error(`ECOS 에러: ${json.RESULT.MESSAGE ?? json.RESULT.CODE}`)

  const rows = json?.StatisticSearch?.row
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('ECOS: 데이터 행 없음')

  return rows
    .map((r: any) => ({ date: String(r.TIME), value: Number(r.DATA_VALUE) }))
    .filter((p: any) => Number.isFinite(p.value))
}

/* ── KOSIS (통계청) ──
   itmId/objL1을 ALL로 요청해 분류 코드를 모르는 위험을 줄이고, 응답 안의 여러 계열(그룹) 중
   keyword(있으면 ITM_NM/C1_NM에 포함되는 것 우선)와 데이터 개수를 기준으로 대표 계열을 채택 */
async function fetchKosisSeries(orgId: string, tblId: string, prdSe: string, start: string, end: string, keyword?: string) {
  const url = `https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=${KOSIS_KEY}&itmId=ALL&objL1=ALL&format=json&jsonVD=Y&prdSe=${prdSe}&startPrdDe=${start}&endPrdDe=${end}&orgId=${orgId}&tblId=${tblId}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`KOSIS 응답 실패 (${res.status})`)

  const json = await res.json()
  if (!Array.isArray(json)) {
    throw new Error(`KOSIS 에러: ${JSON.stringify(json).slice(0, 300)}`)
  }
  if (json.length === 0) throw new Error('KOSIS: 데이터 없음')

  const groups = new Map<string, any[]>()
  for (const row of json) {
    const key = `${row.ITM_ID ?? ''}__${row.C1 ?? ''}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }
  const entries = [...groups.entries()]
  const matched = keyword
    ? entries.filter(([, rows]) => `${rows[0]?.ITM_NM ?? ''}${rows[0]?.C1_NM ?? ''}`.includes(keyword))
    : []
  const pool = matched.length > 0 ? matched : entries
  const largest = pool.sort((a, b) => b[1].length - a[1].length)[0][1]

  return largest
    .map((r: any) => ({ date: String(r.PRD_DE), value: Number(r.DT) }))
    .filter((p: any) => Number.isFinite(p.value))
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
}

async function safeFetch(label: string, fn: () => Promise<any>) {
  try {
    return await fn()
  } catch (error) {
    console.error(`[economic-stats] ${label} 실패:`, error.message)
    return null
  }
}

async function fetchAll() {
  const [baseRate, cpi, unemployment, gdpGrowth, tradeBalance, termSpread] = await Promise.all([
    safeFetch('기준금리', async () => {
      const rows = await fetchEcosSeries('722Y001', '0101000', 'M', yyyymm(9), yyyymm(0))
      return rows.map(r => ({ date: r.date, value: round2(r.value) }))
    }),
    safeFetch('CPI', async () => {
      // 프론트에서 전년동월대비 상승률(YoY)을 계산하려면 12개월 전 지수가 필요하므로,
      // 화면에 보여줄 9개월치보다 12개월 더 넓게(21개월치) 지수를 받아온다.
      // 여기서 반환하는 값은 여전히 지수 레벨(2020=100) — 변환은 프론트에서 한다.
      const rows = await fetchKosisSeries('101', 'DT_1J22003', 'M', yyyymm(21), yyyymm(0))
      return rows.map(r => ({ date: r.date, value: round2(r.value) }))
    }),
    safeFetch('실업률', async () => {
      const rows = await fetchKosisSeries('101', 'DT_1DA7004S', 'M', yyyymm(9), yyyymm(0), '실업률')
      return rows.map(r => ({ date: r.date, value: round2(r.value) }))
    }),
    safeFetch('GDP 성장률', async () => {
      // 잠재성장률(연 기준) 추정치와 직접 비교하려면 전기대비(QoQ)가 아니라
      // 전년동기대비(YoY) 계열이 필요 — 항목명에 '전년동기'가 포함된 계열을 우선 채택.
      // 매칭되는 항목이 없으면 fetchKosisSeries가 조용히 가장 큰 그룹(QoQ)으로 폴백하므로,
      // 배포 후 실제 값(예: 최근 분기 ECOS 공식 발표치)과 대조해 확인이 필요하다.
      const rows = await fetchKosisSeries('301', 'DT_200Y102', 'Q', yyyyq(8), yyyyq(0), '전년동기')
      return rows.map(r => ({ date: r.date, value: round2(r.value) }))
    }),
    safeFetch('무역수지', async () => {
      const rows = await fetchKosisSeries('134', 'DT_134001_001', 'M', yyyymm(9), yyyymm(0), '무역수지')
      return rows.map(r => ({ date: r.date, value: round2(r.value) }))
    }),
    safeFetch('장단기금리역전', async () => {
      // 817Y002는 일별(D) 주기로만 제공됨 — 최근 40일치를 받아 추이로 사용
      const [y3, y10] = await Promise.all([
        fetchEcosSeries('817Y002', '010200000', 'D', yyyymmdd(40), yyyymmdd(0)), // 국고채(3년)
        fetchEcosSeries('817Y002', '010210000', 'D', yyyymmdd(40), yyyymmdd(0)), // 국고채(10년)
      ])
      const map3 = new Map(y3.map(p => [p.date, p.value]))
      const spread = y10
        .filter(p => map3.has(p.date))
        .map(p => ({ date: p.date, value: round2(p.value - (map3.get(p.date) as number)) }))
      if (spread.length === 0) throw new Error('3년물/10년물 날짜 매칭 실패')
      return spread
    }),
  ])
  return { baseRate, cpi, unemployment, gdpGrowth, tradeBalance, termSpread }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await fetchAll()
    cache = { data, fetchedAt: Date.now() }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
