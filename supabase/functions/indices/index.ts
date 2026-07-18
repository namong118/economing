import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Yahoo Finance 비공식 API는 기본 fetch User-Agent로는 종종 차단되므로 브라우저 UA를 지정
const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
}

// range=1mo&interval=1d — meta(현재값)와 최근 1개월 일별 종가를 한 번의 요청으로 함께 받음
async function fetchYahooIndex(symbol: string) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`,
      { headers: YAHOO_HEADERS }
    )
    if (!res.ok) throw new Error(`Yahoo Finance 응답 실패 (${res.status})`)

    const data   = await res.json()
    const result = data?.chart?.result?.[0]
    const meta   = result?.meta

    if (!meta || typeof meta.regularMarketPrice !== 'number') {
      throw new Error('meta.regularMarketPrice 없음')
    }

    const value     = meta.regularMarketPrice
    const prevClose = meta.previousClose ?? meta.chartPreviousClose

    let change = null, changePercent = null
    if (typeof prevClose === 'number' && prevClose !== 0) {
      change        = round2(value - prevClose)
      changePercent = round2(((value - prevClose) / prevClose) * 100)
    }

    const history = buildYahooHistory(result)

    return { value: round2(value), change, changePercent, history }
  } catch (error) {
    console.error(`[indices] ${symbol} 조회 실패:`, error.message)
    return null
  }
}

function buildYahooHistory(result: any) {
  const timestamps = result?.timestamp ?? []
  const closes     = result?.indicators?.quote?.[0]?.close ?? []

  return timestamps
    .map((ts: number, i: number) => ({
      date:  new Date(ts * 1000).toISOString().slice(0, 10),
      value: closes[i],
    }))
    .filter((point: any) => typeof point.value === 'number')
    .map((point: any) => ({ date: point.date, value: round2(point.value) }))
}

async function fetchUsdKrw() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error(`환율 API 응답 실패 (${res.status})`)

    const data  = await res.json()
    const value = data?.rates?.KRW

    if (typeof value !== 'number') throw new Error('rates.KRW 없음')

    // 환율은 open.er-api.com이 과거 데이터를 주지 않아 별도 무료 소스(Frankfurter, ECB 기준)로 조회
    // 실패해도 현재값은 그대로 반환 — history만 빈 배열로 빠짐 (추이 차트만 생략)
    const history = await fetchUsdKrwHistory()

    return { value: round2(value), history }
  } catch (error) {
    console.error('[indices] 환율 조회 실패:', error.message)
    return null
  }
}

async function fetchUsdKrwHistory() {
  try {
    const end   = new Date()
    const start = new Date(end)
    start.setMonth(start.getMonth() - 1)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const res = await fetch(`https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=USD&to=KRW`)
    if (!res.ok) throw new Error(`환율 히스토리 응답 실패 (${res.status})`)

    const data  = await res.json()
    const rates = data?.rates ?? {}

    return Object.entries(rates)
      .map(([date, r]: [string, any]) => ({ date, value: typeof r?.KRW === 'number' ? round2(r.KRW) : null }))
      .filter((point) => typeof point.value === 'number')
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('[indices] 환율 히스토리 조회 실패:', error.message)
    return []
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const [kospi, kosdaq, usdkrw] = await Promise.all([
      fetchYahooIndex('^KS11'),
      fetchYahooIndex('^KQ11'),
      fetchUsdKrw(),
    ])

    return new Response(JSON.stringify({ kospi, kosdaq, usdkrw }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
