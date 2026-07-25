#!/usr/bin/env node
/**
 * 콘텐츠 갭 분석 (일회성 스크립트)
 *
 * 목적: 실제 경제 뉴스에 등장하는 개념어 중 economicBites/indicatorsData가
 * 커버하는 비율을 측정하고, 없는 개념을 빈도순으로 뽑아 우선순위를 정한다.
 *
 * 설계 원칙: 키워드 추출은 기존 70개 콘텐츠와 완전히 무관하게 수행한다.
 * (뉴스 → 개념어 추출 → 그 다음 70개와 대조. 절대 역순으로 하지 않는다.)
 *
 * 실행: node scripts/analyze-content-gap.mjs [--refresh] [--refresh-classify]
 *   --refresh          뉴스 재수집 + 개념어 재추출 (+ 갭 분류도 함께 재실행)
 *   --refresh-classify 갭 분류만 재실행 (개념어 추출 캐시는 그대로 재사용)
 * 프로덕션 코드는 읽기만 하며 수정하지 않는다.
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import economicBites from '../src/data/economicBites.js'
import indicatorsData from '../src/data/indicatorsData.js'

config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.join(__dirname, '.cache')
const CACHE_PATH = path.join(CACHE_DIR, 'keywords.json')
const CLASSIFY_CACHE_PATH = path.join(CACHE_DIR, 'classification.json')
const OUTPUT_DIR = path.join(__dirname, 'output')
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'content-gap-report.md')

// 캐시 스키마 버전 — 기사 단위 attribution({concept, articles})이 추가된 시점에 올림.
// 구버전 캐시(평면 문자열 배열)는 호환되지 않으므로 --refresh를 요구한다.
const CACHE_SCHEMA_VERSION = 2
const CLASSIFY_SCHEMA_VERSION = 1
const TOP_GAP_CLASSIFY_COUNT = 50
const CLASSIFY_BATCH_SIZE = 10

const REFRESH = process.argv.includes('--refresh')
// 갭 분류만 다시 하고 싶을 때 (키워드 재추출은 비용이 크므로 별도 플래그로 분리)
const REFRESH_CLASSIFY = REFRESH || process.argv.includes('--refresh-classify')
const TARGET_ARTICLE_COUNT = 300
const BATCH_SIZE = 10

const NEWS_QUERIES = ['금리', '증시', '부동산', '환율', '물가', '투자', '세금', '수출', '가계부채']

// 뉴스 검색 쿼리(혹은 news_cache의 기존 category 값) → 콘텐츠 카테고리 매핑
// Tier 3 카테고리 폴백과 6번 수급 비교에 쓰이는 판단값. '경제'처럼 너무 포괄적인
// 쿼리는 특정 카테고리로 단정하지 않고 미분류로 남긴다 (임의 배정 방지).
const QUERY_TO_CONTENT_CATEGORY = {
  '금리': '금리',
  '증시': '투자',
  '주식': '투자',
  '투자': '투자',
  '부동산': '부동산',
  '환율': '거시경제',
  '물가': '거시경제',
  '글로벌경제': '거시경제',
  '세금': '실생활경제',
  '수출': '거시경제',
  '가계부채': '실생활경제',
  '경제': null, // news_cache에 남아있는 구 카테고리, 너무 포괄적이라 미분류 처리
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 .env.local에 없어요.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── 1단계: 뉴스 수집 ──────────────────────────────────────────────

// category='경제'는 너무 포괄적이라 지자체 홍보/일반 기사가 많이 섞여 갭 목록을
// 오염시킨다 (실측: news_cache 150건 중 105건이 '경제' 태그). 제외하고 로드한다.
async function fetchCachedNews() {
  const { data, error } = await supabase.from('news_cache').select('category, date, data').neq('category', '경제')
  if (error) throw new Error(`news_cache 조회 실패: ${error.message}`)

  const articles = []
  for (const row of data ?? []) {
    for (const item of row.data ?? []) {
      if (!item?.title) continue
      articles.push({
        title: item.title,
        description: item.description ?? '',
        category: row.category,
        source: 'cache',
      })
    }
  }
  return articles
}

async function fetchFreshNews() {
  const articles = []
  for (const query of NEWS_QUERIES) {
    const { data, error } = await supabase.functions.invoke('news', {
      body: { query, display: 50 },
    })
    if (error) {
      console.warn(`  ⚠ '${query}' 검색 실패: ${error.message}`)
      continue
    }
    const items = data?.items ?? []
    console.log(`  '${query}': ${items.length}건`)
    for (const item of items) {
      if (!item?.title) continue
      articles.push({
        title: item.title,
        description: item.description ?? '',
        category: query,
        source: 'fresh',
      })
    }
  }
  return articles
}

function dedupeByTitle(articles) {
  const seen = new Map()
  for (const a of articles) {
    const key = a.title.trim()
    if (!seen.has(key)) seen.set(key, a)
  }
  return [...seen.values()]
}

function groupByCategory(articles) {
  const map = new Map()
  for (const a of articles) {
    if (!map.has(a.category)) map.set(a.category, [])
    map.get(a.category).push(a)
  }
  return map
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// ── 2단계: 개념어 추출 (Solar) ─────────────────────────────────────

// 개념마다 등장한 기사 번호([1],[2]...)를 함께 받아서 기사 단위 커버리지 계산에 쓴다.
const EXTRACT_SYSTEM = `다음 기사들에서 경제/금융 "개념어"만 추출해라. 기업명, 인명, 기관명, 지역명, 날짜는 제외한다. 개인 투자자나 소비자가 배워두면 실제로 도움이 되는 경제·금융 개념만 포함한다. 특정 지역·기관의 정책 사업명, 행사명, 복권·경품 등은 제외한다. 각 개념이 등장한 기사 번호도 함께 표시해라. JSON 배열로만 응답, 다른 텍스트 금지: [{"concept":"개념명","articles":[1,3]}, ...]`

// AI가 형식을 완전히 안 지켜도(문자열만 반환 등) 최대한 살려서 쓴다
function normalizeExtractedItem(x) {
  if (typeof x === 'string' && x.trim()) return { concept: x.trim(), articles: [] }
  if (x && typeof x === 'object' && typeof x.concept === 'string' && x.concept.trim()) {
    const articles = Array.isArray(x.articles) ? x.articles.filter((n) => Number.isInteger(n)) : []
    return { concept: x.concept.trim(), articles }
  }
  return null
}

async function extractConceptsFromBatch(batch) {
  const content = batch
    .map((a, i) => `[${i + 1}] 제목: ${a.title}\n내용: ${a.description}`)
    .join('\n\n')

  const { data, error } = await supabase.functions.invoke('solar', {
    body: { system: EXTRACT_SYSTEM, messages: [{ role: 'user', content }] },
  })
  if (error) {
    console.warn(`  ⚠ Solar 호출 실패: ${error.message}`)
    return []
  }

  const raw = data?.content ?? '[]'
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    const parsed = JSON.parse(match ? match[0] : clean)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeExtractedItem).filter(Boolean)
  } catch {
    console.warn(`  ⚠ Solar 응답 파싱 실패, 원본 일부: ${raw.slice(0, 150)}`)
    return []
  }
}

async function extractAllConcepts(articles) {
  const grouped = groupByCategory(articles)
  const batches = []
  let batchNum = 0
  let totalBatches = 0
  for (const list of grouped.values()) totalBatches += Math.ceil(list.length / BATCH_SIZE)

  for (const [category, list] of grouped) {
    for (const batch of chunk(list, BATCH_SIZE)) {
      batchNum += 1
      process.stdout.write(`\r  Solar 추출 중... ${batchNum}/${totalBatches}`)
      const concepts = await extractConceptsFromBatch(batch)
      batches.push({
        category,
        articleTitles: batch.map((a) => a.title),
        concepts, // [{ concept, articles: [1-based index into articleTitles] }]
      })
    }
  }
  console.log('')
  return batches
}

// ── 3단계: 정규화 ─────────────────────────────────────────────────

// 순서 중요: 긴 조사부터 검사해야 "으로"를 "로"로 잘못 자르지 않는다.
const TRAILING_PARTICLES = ['으로', '이', '가', '은', '는', '을', '를', '의', '에', '도', '만', '과', '와', '로'].sort(
  (a, b) => b.length - a.length
)

function stripWhitespace(s) {
  return s.replace(/\s+/g, '')
}

// "소비자물가지수(CPI)" → ["소비자물가지수", "CPI"] 처럼 괄호 안팎을 분리한다.
function splitParenthetical(s) {
  const m = s.match(/^(.*?)\(([^)]*)\)(.*)$/)
  if (!m) return [s]
  const [, before, inside, after] = m
  return [(before + after).trim(), inside.trim()].filter(Boolean)
}

function stripTrailingParticle(s) {
  for (const p of TRAILING_PARTICLES) {
    if (s.length > p.length + 1 && s.endsWith(p)) return s.slice(0, -p.length)
  }
  return null
}

// 원형 그대로의 매칭 후보만 (조사 제거 없음)
function primaryVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (cleaned) variants.add(cleaned)
  }
  return [...variants]
}

// 조사를 제거한 폴백 후보만 — 원형이 매칭 안 될 때만 시도한다 (2단계 매칭용)
function particleStrippedVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    const stripped = stripTrailingParticle(cleaned)
    if (stripped) variants.add(stripped)
  }
  return [...variants]
}

// 콘텐츠 쪽 용어 색인을 만들 때는 원형+조사제거형을 굳이 순서 구분할 필요가 없어
// 둘 다 합쳐서 키로 등록한다 (색인은 순서가 없는 조회 테이블이라 안전함)
function normalizeVariants(raw) {
  return [...new Set([...primaryVariants(raw), ...particleStrippedVariants(raw)])]
}

// 뉴스에서 뽑힌 개념어를 배치 간에 집계(그룹핑)할 때 쓰는 대표키 하나
// (괄호 바깥쪽 + 조사 제거 우선형을 대표로 삼는다 — 매칭 순서와 무관한 별개 목적)
function canonicalKey(raw) {
  const outer = splitParenthetical(raw)[0] ?? raw
  const cleaned = stripWhitespace(outer).toUpperCase()
  return stripTrailingParticle(cleaned) ?? cleaned
}

function printNormalizationSamples(concepts) {
  const interesting = []
  const plain = []
  for (const c of concepts) {
    const variants = normalizeVariants(c)
    const changed = variants.length > 1 || variants[0] !== c
    ;(changed ? interesting : plain).push({ raw: c, variants })
  }
  const sample = [...interesting, ...plain].slice(0, 20)
  console.log('\n[정규화 샘플 20개] (원본 → 매칭용 변형들, 실제 매칭은 원형 우선 → 조사제거형은 폴백)')
  for (const s of sample) {
    console.log(`  "${s.raw}" → [${s.variants.join(', ')}]`)
  }
}

// ── 4단계: 콘텐츠 인덱스 + 3단계 매칭 ────────────────────────────────

const ALL_CONTENT = [...economicBites, ...indicatorsData]

function buildTermIndex(items, includeRelatedTerms) {
  const index = new Map()
  for (const item of items) {
    const terms = includeRelatedTerms ? [item.title, ...(item.relatedTerms ?? [])] : [item.title]
    for (const term of terms) {
      for (const variant of normalizeVariants(term)) {
        if (!index.has(variant)) index.set(variant, [])
        index.get(variant).push(item)
      }
    }
  }
  return index
}

function aggregateConcepts(batches) {
  const agg = new Map()
  for (const batch of batches) {
    for (const { concept: rawConcept, articles: positions } of batch.concepts) {
      const key = canonicalKey(rawConcept)
      if (!key) continue
      if (!agg.has(key)) {
        agg.set(key, { displayRaw: rawConcept, count: 0, categories: new Map(), articleTitleSet: new Set() })
      }
      const entry = agg.get(key)
      const occurrences = positions.length || 1 // AI가 번호를 안 줬어도 최소 1회는 카운트
      entry.count += occurrences
      entry.categories.set(batch.category, (entry.categories.get(batch.category) ?? 0) + occurrences)
      for (const pos of positions) {
        const title = batch.articleTitles[pos - 1]
        if (title) entry.articleTitleSet.add(title)
      }
    }
  }
  return agg
}

function dominantCategory(categoryCounts) {
  return [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

// 원형 변형들로만 먼저 조회하고, 아무것도 안 걸리면 그때만 조사 제거형으로 재시도한다.
function tryMatch(variants, tier1Index, tier2Index) {
  for (const v of variants) {
    if (tier1Index.has(v)) return { matchTier: 1, matchedItems: tier1Index.get(v) }
  }
  for (const v of variants) {
    if (tier2Index.has(v)) return { matchTier: 2, matchedItems: tier2Index.get(v) }
  }
  return null
}

function matchAllTiers(aggMap, tier1Index, tier2Index, categoriesWithContent) {
  const results = []
  for (const entry of aggMap.values()) {
    const domCat = dominantCategory(entry.categories)

    let match = tryMatch(primaryVariants(entry.displayRaw), tier1Index, tier2Index)
    if (!match) match = tryMatch(particleStrippedVariants(entry.displayRaw), tier1Index, tier2Index)

    let matchTier = match?.matchTier ?? null
    let matchedItems = match?.matchedItems ?? null
    let fallbackCategory = null

    if (!matchTier) {
      const mapped = QUERY_TO_CONTENT_CATEGORY[domCat] ?? null
      if (mapped && categoriesWithContent.has(mapped)) {
        matchTier = 3
        fallbackCategory = mapped
      }
    }

    results.push({
      concept: entry.displayRaw, // 리포트/갭 목록에는 항상 이 원형만 노출한다
      count: entry.count,
      dominantCategory: domCat,
      articleTitleSet: entry.articleTitleSet,
      matchTier,
      matchedItems,
      fallbackCategory,
    })
  }
  return results
}

function exampleTitleOf(conceptResult) {
  return [...conceptResult.articleTitleSet][0] ?? '(기사 매핑 없음)'
}

// ── 개선 1: 3종 커버리지 지표 ─────────────────────────────────────

function computeCoverage(conceptResults, predicate, totalArticles, totalFreq) {
  const covered = conceptResults.filter(predicate)
  const freqCovered = covered.reduce((s, c) => s + c.count, 0)
  const articleSet = new Set()
  for (const c of covered) for (const t of c.articleTitleSet) articleSet.add(t)
  const total = conceptResults.length
  return {
    uniqueCovered: covered.length,
    uniqueTotal: total,
    uniquePct: total ? (covered.length / total) * 100 : 0,
    freqCovered,
    freqTotal: totalFreq,
    freqPct: totalFreq ? (freqCovered / totalFreq) * 100 : 0,
    articleCovered: articleSet.size,
    articleTotal: totalArticles,
    articlePct: totalArticles ? (articleSet.size / totalArticles) * 100 : 0,
  }
}

// ── 갭 분류 (ALIAS / NEW / OUT) ───────────────────────────────────

const CLASSIFY_SYSTEM_HEADER = `다음은 뉴스에 등장했지만 우리 콘텐츠에 없는 것으로 보이는 경제 개념어 목록이다. 아래 기존 콘텐츠 제목 목록과 비교해서 각 번호별로 하나씩 분류해라.

[기존 콘텐츠 제목 목록]
__TITLES__

분류 기준:
- ALIAS: 기존 한잎의 내용을 그대로 읽는 것만으로 이 뉴스 개념이 충분히 이해되는 경우
  (예: '물가' 뉴스를 읽는 데 '인플레이션' 한잎이면 충분함 → ALIAS). 이 경우 maps_to에
  대응되는 기존 제목을 정확히 그대로 적어라.
- NEW: 기존 한잎을 읽어도 이 개념은 별도 설명이 필요한 경우. 상위어/하위어 관계는
  항상 NEW다 (예: '레버리지 ETF'는 'ETF' 한잎만으로는 부족하므로 ALIAS가 아니라 NEW).
- OUT: 개인 투자자·소비자 학습 콘텐츠로 부적합하다 (지역/기관 홍보성, 일회성 이슈 등).

애매하면 ALIAS 대신 NEW로 분류해라 (ALIAS 오분류가 더 위험함 — 실제로는 다른 개념인데 같다고 묶으면 잘못된 콘텐츠가 노출됨).

JSON 배열로만 응답, 다른 텍스트 금지: [{"index":1,"verdict":"ALIAS","maps_to":"대응 제목 또는 null","reason":"한 줄"}]`

function buildClassifySystem() {
  return CLASSIFY_SYSTEM_HEADER.replace('__TITLES__', ALL_CONTENT.map((item) => item.title).join(', '))
}

async function classifyBatch(batch, systemPrompt) {
  const content = batch.map((g, i) => `[${i + 1}] ${g.concept}`).join('\n')
  const { data, error } = await supabase.functions.invoke('solar', {
    body: { system: systemPrompt, messages: [{ role: 'user', content }] },
  })
  if (error) {
    console.warn(`  ⚠ 분류 Solar 호출 실패: ${error.message}`)
    return []
  }

  const raw = data?.content ?? '[]'
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    const parsed = JSON.parse(match ? match[0] : clean)
    if (!Array.isArray(parsed)) return []

    const results = []
    for (const item of parsed) {
      const idx = Number(item?.index)
      if (!Number.isInteger(idx) || idx < 1 || idx > batch.length) continue
      const verdict = ['ALIAS', 'NEW', 'OUT'].includes(item?.verdict) ? item.verdict : null
      if (!verdict) continue
      const g = batch[idx - 1]
      results.push({
        term: g.concept,
        count: g.count,
        exampleTitle: exampleTitleOf(g),
        dominantCategory: g.dominantCategory,
        verdict,
        mapsTo: verdict === 'ALIAS' ? item.maps_to ?? null : null,
        reason: typeof item.reason === 'string' ? item.reason : '',
      })
    }
    return results
  } catch {
    console.warn(`  ⚠ 분류 응답 파싱 실패, 원본 일부: ${raw.slice(0, 150)}`)
    return []
  }
}

async function classifyAllGaps(gapsTop) {
  const systemPrompt = buildClassifySystem()
  const results = []
  const chunks = chunk(gapsTop, CLASSIFY_BATCH_SIZE)
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`\r  갭 분류 중... ${i + 1}/${chunks.length}`)
    results.push(...(await classifyBatch(chunks[i], systemPrompt)))
  }
  console.log('')
  return results
}

function loadClassifyCache(currentTerms) {
  if (REFRESH_CLASSIFY || !fs.existsSync(CLASSIFY_CACHE_PATH)) return null
  const loaded = JSON.parse(fs.readFileSync(CLASSIFY_CACHE_PATH, 'utf-8'))
  if (loaded.meta?.schemaVersion !== CLASSIFY_SCHEMA_VERSION) {
    console.log('갭 분류 캐시가 구버전이라 재사용할 수 없어요 — 재분류를 진행해요.')
    return null
  }
  const cachedTerms = loaded.meta?.terms ?? []
  const same = cachedTerms.length === currentTerms.length && cachedTerms.every((t, i) => t === currentTerms[i])
  if (!same) {
    console.log('갭 목록이 이전 분류 캐시와 달라서 재사용할 수 없어요 — 재분류를 진행해요.')
    return null
  }
  console.log(`캐시된 갭 분류 결과를 재사용해요 (${loaded.meta.generatedAt} 생성, --refresh-classify로 재분류 가능)`)
  return loaded.results
}

function saveClassifyCache(terms, results) {
  fs.writeFileSync(
    CLASSIFY_CACHE_PATH,
    JSON.stringify(
      { meta: { schemaVersion: CLASSIFY_SCHEMA_VERSION, generatedAt: new Date().toISOString(), terms }, results },
      null,
      2
    )
  )
}

// ALIAS를 전부 매칭 완료로 간주했을 때의 시뮬레이션 (실제 매칭 로직은 건드리지 않음)
// 사용자 지시대로 Tier 1(제목 완전 일치) 기준으로 시뮬레이션한다 — Tier 2는 포함하지 않음
function buildAliasSimulation(conceptResults, classifyResults, totalArticles, totalFreq) {
  const aliasKeys = new Set(classifyResults.filter((r) => r.verdict === 'ALIAS').map((r) => canonicalKey(r.term)))
  const before = computeCoverage(conceptResults, (c) => c.matchTier === 1, totalArticles, totalFreq)
  const after = computeCoverage(
    conceptResults,
    (c) => c.matchTier === 1 || aliasKeys.has(canonicalKey(c.concept)),
    totalArticles,
    totalFreq
  )
  return { before, after, aliasAppliedCount: aliasKeys.size }
}

// ── 5단계: 리포트 ────────────────────────────────────────────────

function buildReport({ collectionSummary, coverageRows, hitConcentration, deadStock, gaps, categorySupplyDemand, classifyResults, aliasSimulation }) {
  const lines = []
  lines.push('# ECONOMING 콘텐츠 갭 분석 리포트')
  lines.push('')
  lines.push(`생성 시각: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('> **실질 커버리지는 Tier 1(제목 완전 일치) 기준이다.** 카테고리 존재율(구 Tier 3)은')
  lines.push('> "경제 뉴스의 모든 개념은 경제 카테고리 8개 중 하나에 속한다"는 동어반복에 가까워')
  lines.push('> 정보값이 낮으므로 참고용으로만 병기한다.')
  lines.push('')

  lines.push('## 1. 수집 요약')
  lines.push('')
  lines.push(`- 캐시(news_cache) 기사: ${collectionSummary.cacheCount}건`)
  lines.push(`- 신규 수집(뉴스 API) 기사: ${collectionSummary.freshCount}건`)
  lines.push(`- 중복 제거 후 총 기사: ${collectionSummary.totalCount}건 (목표 ${TARGET_ARTICLE_COUNT}건${collectionSummary.totalCount < TARGET_ARTICLE_COUNT ? ' — 미달, 경고만 하고 진행함' : ''})`)
  lines.push(`- 추출된 고유 개념어 수: ${collectionSummary.uniqueConceptCount}개`)
  lines.push('')

  lines.push('## 2. 커버리지 (Tier 1/2 × 3종 지표, 카테고리 존재율은 참고용)')
  lines.push('')
  lines.push('- **고유 개념 커버리지**: 매칭된 고유 개념 수 / 전체 고유 개념 수 (콘텐츠 다양성)')
  lines.push('- **빈도 가중 커버리지**: 매칭된 개념의 등장 횟수 합 / 전체 등장 횟수 합')
  lines.push('- **기사 단위 커버리지**: 우리 콘텐츠가 하나라도 등장한 기사 수 / 전체 기사 수 (실사용 체감치)')
  lines.push('')
  lines.push('| 구분 | 정의 | 고유 개념 커버리지 | 빈도 가중 커버리지 | 기사 단위 커버리지 |')
  lines.push('|---|---|---|---|---|')
  for (const r of coverageRows) {
    lines.push(
      `| ${r.tier} | ${r.desc} | ${r.cov.uniqueCovered}/${r.cov.uniqueTotal} (${r.cov.uniquePct.toFixed(1)}%) | ${r.cov.freqCovered}/${r.cov.freqTotal} (${r.cov.freqPct.toFixed(1)}%) | ${r.cov.articleCovered}/${r.cov.articleTotal} (${r.cov.articlePct.toFixed(1)}%) |`
    )
  }
  lines.push('')
  lines.push('※ "카테고리 존재율"은 해당 개념과 같은 카테고리에 콘텐츠가 하나라도 있다는 뜻일 뿐,')
  lines.push('그 개념을 실제로 다룬다는 뜻이 아니다. 실질 커버리지 판단에는 쓰지 않는다.')
  lines.push('')

  lines.push('## 3. 히트 편중 분석 (Tier 2 기준)')
  lines.push('')
  lines.push(`- 매칭된 한잎(콘텐츠) 총 히트 수: ${hitConcentration.totalHits}`)
  lines.push(`- 상위 10개 콘텐츠가 차지하는 비율: **${hitConcentration.top10Pct.toFixed(1)}%**`)
  lines.push('')
  lines.push('| 순위 | 제목 | 카테고리 | 히트 수 |')
  lines.push('|---|---|---|---|')
  hitConcentration.sorted.slice(0, 20).forEach((h, i) => {
    lines.push(`| ${i + 1} | ${h.item.title} | ${h.item.category} | ${h.hits} |`)
  })
  lines.push('')

  lines.push('## 4. 죽은 재고 (한 번도 매칭 안 된 콘텐츠)')
  lines.push('')
  lines.push(`- 총 ${deadStock.length}개 / 전체 ${ALL_CONTENT.length}개`)
  lines.push('')
  lines.push('| 제목 | 카테고리 |')
  lines.push('|---|---|')
  for (const item of deadStock) {
    lines.push(`| ${item.title} | ${item.category} |`)
  }
  lines.push('')

  lines.push('## 5. 갭 목록 — 뉴스에는 있지만 우리에게 없는 개념 TOP 40')
  lines.push('')
  lines.push('(Tier 1 — 제목 완전 일치 — 미매칭 개념만 포함. 카테고리 존재율은 갭 판정에 쓰지 않음. 조사 제거형이 아닌 원형만 표시)')
  lines.push('')
  lines.push('| 순위 | 개념어 | 등장 횟수 | 기사 제목 예시 |')
  lines.push('|---|---|---|---|')
  gaps.forEach((g, i) => {
    lines.push(`| ${i + 1} | ${g.concept} | ${g.count} | ${exampleTitleOf(g)} |`)
  })
  lines.push('')

  lines.push('## 6. 카테고리별 수급 비교')
  lines.push('')
  lines.push('(뉴스 개념어의 카테고리는 검색 쿼리/원본 category를 콘텐츠 카테고리 체계로 매핑한 값. "경제"처럼 너무 포괄적인 쿼리는 미분류로 남김)')
  lines.push('')
  lines.push('| 카테고리 | 보유 콘텐츠 수 | 뉴스 개념어 등장 횟수(수요) |')
  lines.push('|---|---|---|')
  for (const row of categorySupplyDemand) {
    lines.push(`| ${row.category} | ${row.supply} | ${row.demand} |`)
  }
  lines.push('')

  if (classifyResults) {
    const aliasList = classifyResults.filter((r) => r.verdict === 'ALIAS')
    const newList = classifyResults.filter((r) => r.verdict === 'NEW')
    const outList = classifyResults.filter((r) => r.verdict === 'OUT')
    const total = classifyResults.length || 1

    lines.push(`## 7. 갭 분류 (ALIAS / NEW / OUT) — 상위 ${classifyResults.length}개 대상`)
    lines.push('')
    lines.push('| 분류 | 개수 | 비율 |')
    lines.push('|---|---|---|')
    lines.push(`| ALIAS (표기만 다름) | ${aliasList.length} | ${((aliasList.length / total) * 100).toFixed(1)}% |`)
    lines.push(`| NEW (신규 제작 필요) | ${newList.length} | ${((newList.length / total) * 100).toFixed(1)}% |`)
    lines.push(`| OUT (노이즈) | ${outList.length} | ${((outList.length / total) * 100).toFixed(1)}% |`)
    lines.push('')

    lines.push('### ALIAS 목록 (aliases 필드 초안)')
    lines.push('')
    lines.push('| 개념어 | 대응 한잎 | 등장 횟수 | 사유 |')
    lines.push('|---|---|---|---|')
    for (const r of aliasList.sort((a, b) => b.count - a.count)) {
      lines.push(`| ${r.term} | ${r.mapsTo ?? '(미지정)'} | ${r.count} | ${r.reason} |`)
    }
    lines.push('')

    lines.push('### NEW 목록 (콘텐츠 제작 우선순위)')
    lines.push('')
    lines.push('| 개념어 | 추정 카테고리 | 등장 횟수 | 사유 |')
    lines.push('|---|---|---|---|')
    for (const r of newList.sort((a, b) => b.count - a.count)) {
      const estCategory = QUERY_TO_CONTENT_CATEGORY[r.dominantCategory] ?? r.dominantCategory ?? '미분류'
      lines.push(`| ${r.term} | ${estCategory} | ${r.count} | ${r.reason} |`)
    }
    lines.push('')
  }

  if (aliasSimulation) {
    lines.push('## 8. ALIAS 반영 시 예상 커버리지 (시뮬레이션 — 실제로 반영하지 않음)')
    lines.push('')
    lines.push(`Tier 1 매칭 기준으로, 상위 갭 중 ALIAS로 분류된 ${aliasSimulation.aliasAppliedCount}개를 매칭 완료로 가정했을 때:`)
    lines.push('')
    lines.push('| 지표 | 현재 (Tier 2) | ALIAS 반영 시뮬레이션 |')
    lines.push('|---|---|---|')
    lines.push(
      `| 고유 개념 커버리지 | ${aliasSimulation.before.uniqueCovered}/${aliasSimulation.before.uniqueTotal} (${aliasSimulation.before.uniquePct.toFixed(1)}%) | ${aliasSimulation.after.uniqueCovered}/${aliasSimulation.after.uniqueTotal} (${aliasSimulation.after.uniquePct.toFixed(1)}%) |`
    )
    lines.push(
      `| 빈도 가중 커버리지 | ${aliasSimulation.before.freqCovered}/${aliasSimulation.before.freqTotal} (${aliasSimulation.before.freqPct.toFixed(1)}%) | ${aliasSimulation.after.freqCovered}/${aliasSimulation.after.freqTotal} (${aliasSimulation.after.freqPct.toFixed(1)}%) |`
    )
    lines.push(
      `| 기사 단위 커버리지 | ${aliasSimulation.before.articleCovered}/${aliasSimulation.before.articleTotal} (${aliasSimulation.before.articlePct.toFixed(1)}%) | ${aliasSimulation.after.articleCovered}/${aliasSimulation.after.articleTotal} (${aliasSimulation.after.articlePct.toFixed(1)}%) |`
    )
    lines.push('')
  }

  return lines.join('\n')
}

// ── 메인 ─────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  let cached = null
  if (!REFRESH && fs.existsSync(CACHE_PATH)) {
    const loaded = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
    if (loaded.meta?.schemaVersion === CACHE_SCHEMA_VERSION) {
      cached = loaded
      console.log(`캐시된 개념어를 재사용해요 (${cached.meta.generatedAt} 생성, --refresh로 재추출 가능)`)
    } else {
      console.log('캐시가 구버전 스키마라 재사용할 수 없어요 — 재추출을 진행해요.')
    }
  }

  let collectionSummary
  let batches

  if (cached) {
    batches = cached.batches
    collectionSummary = {
      cacheCount: cached.meta.cacheArticleCount,
      freshCount: cached.meta.freshArticleCount,
      totalCount: cached.meta.totalArticleCount,
      uniqueConceptCount: null, // 아래에서 재계산
    }
  } else {
    console.log('1단계: 뉴스 수집')
    console.log('- news_cache 조회 중...')
    const cachedArticles = await fetchCachedNews()
    console.log(`  news_cache: ${cachedArticles.length}건`)

    console.log('- 신규 뉴스 API 호출 중...')
    const freshArticles = await fetchFreshNews()

    const merged = dedupeByTitle([...cachedArticles, ...freshArticles])
    console.log(`- 중복 제거 후 총 ${merged.length}건 (캐시 ${cachedArticles.length} + 신규 ${freshArticles.length})`)
    if (merged.length < TARGET_ARTICLE_COUNT) {
      console.warn(`  ⚠ 목표(${TARGET_ARTICLE_COUNT}건) 미달이지만 계속 진행해요.`)
    }

    console.log('\n2단계: 개념어 추출 (Solar)')
    batches = await extractAllConcepts(merged)

    collectionSummary = {
      cacheCount: cachedArticles.length,
      freshCount: freshArticles.length,
      totalCount: merged.length,
      uniqueConceptCount: null,
    }

    fs.writeFileSync(
      CACHE_PATH,
      JSON.stringify(
        {
          meta: {
            schemaVersion: CACHE_SCHEMA_VERSION,
            generatedAt: new Date().toISOString(),
            cacheArticleCount: cachedArticles.length,
            freshArticleCount: freshArticles.length,
            totalArticleCount: merged.length,
          },
          batches,
        },
        null,
        2
      )
    )
    console.log(`개념어 추출 결과를 캐시에 저장했어요: ${CACHE_PATH}`)
  }

  console.log('\n3단계: 정규화')
  const agg = aggregateConcepts(batches)
  collectionSummary.uniqueConceptCount = agg.size
  console.log(`고유 개념어 수: ${agg.size}개`)
  printNormalizationSamples([...agg.values()].map((e) => e.displayRaw))

  console.log('\n4단계: 매칭 (Tier 1/2/3)')
  const tier1Index = buildTermIndex(ALL_CONTENT, false)
  const tier2Index = buildTermIndex(ALL_CONTENT, true)
  const categoriesWithContent = new Set(ALL_CONTENT.map((i) => i.category))
  const conceptResults = matchAllTiers(agg, tier1Index, tier2Index, categoriesWithContent)

  const totalArticles = new Set(batches.flatMap((b) => b.articleTitles)).size
  const totalFreq = conceptResults.reduce((s, c) => s + c.count, 0)

  const coverageRows = [
    { tier: 'Tier 1', desc: 'title 완전 일치만', cov: computeCoverage(conceptResults, (c) => c.matchTier === 1, totalArticles, totalFreq) },
    { tier: 'Tier 2', desc: 'Tier 1 + relatedTerms', cov: computeCoverage(conceptResults, (c) => c.matchTier === 1 || c.matchTier === 2, totalArticles, totalFreq) },
    { tier: '카테고리 존재율(참고용)', desc: 'Tier 2 + 같은 카테고리 콘텐츠 존재 여부', cov: computeCoverage(conceptResults, (c) => c.matchTier !== null, totalArticles, totalFreq) },
  ]

  // 히트 편중 (Tier 2 매칭 기준)
  const biteHits = new Map()
  for (const c of conceptResults) {
    if ((c.matchTier === 1 || c.matchTier === 2) && c.matchedItems) {
      const item = c.matchedItems[0]
      if (!biteHits.has(item.id)) biteHits.set(item.id, { item, hits: 0 })
      biteHits.get(item.id).hits += c.count
    }
  }
  const sortedHits = [...biteHits.values()].sort((a, b) => b.hits - a.hits)
  const totalHits = sortedHits.reduce((s, x) => s + x.hits, 0)
  const top10Hits = sortedHits.slice(0, 10).reduce((s, x) => s + x.hits, 0)
  const hitConcentration = {
    sorted: sortedHits,
    totalHits,
    top10Pct: totalHits ? (top10Hits / totalHits) * 100 : 0,
  }

  const deadStock = ALL_CONTENT.filter((item) => !biteHits.has(item.id))

  // 갭 = Tier 1(제목 완전 일치) 미매칭 개념. Tier 3(카테고리 존재)는 절대 갭
  // 판정에 쓰지 않는다 — 카테고리 폴백은 참고용 지표일 뿐 "다룬다"는 뜻이 아님.
  const gapsSorted = conceptResults.filter((c) => c.matchTier !== 1).sort((a, b) => b.count - a.count)
  const gaps = gapsSorted.slice(0, 40)
  const gapsTop50 = gapsSorted.slice(0, TOP_GAP_CLASSIFY_COUNT)

  console.log(`\n갭 분류 (ALIAS/NEW/OUT) — 상위 ${gapsTop50.length}개 대상`)
  const gapTerms = gapsTop50.map((g) => g.concept)
  let classifyResults = loadClassifyCache(gapTerms)
  if (!classifyResults) {
    classifyResults = await classifyAllGaps(gapsTop50)
    saveClassifyCache(gapTerms, classifyResults)
    console.log(`갭 분류 결과를 캐시에 저장했어요: ${CLASSIFY_CACHE_PATH}`)
  }
  const aliasSimulation = buildAliasSimulation(conceptResults, classifyResults, totalArticles, totalFreq)

  // 카테고리별 수급 비교
  const supplyByCategory = new Map()
  for (const item of ALL_CONTENT) supplyByCategory.set(item.category, (supplyByCategory.get(item.category) ?? 0) + 1)
  const demandByCategory = new Map()
  for (const c of conceptResults) {
    const mapped = QUERY_TO_CONTENT_CATEGORY[c.dominantCategory] ?? '미분류'
    demandByCategory.set(mapped, (demandByCategory.get(mapped) ?? 0) + c.count)
  }
  const allCategoryKeys = new Set([...supplyByCategory.keys(), ...demandByCategory.keys()])
  const categorySupplyDemand = [...allCategoryKeys]
    .map((category) => ({
      category,
      supply: supplyByCategory.get(category) ?? 0,
      demand: demandByCategory.get(category) ?? 0,
    }))
    .sort((a, b) => b.demand - a.demand)

  const report = buildReport({ collectionSummary, coverageRows, hitConcentration, deadStock, gaps, categorySupplyDemand, classifyResults, aliasSimulation })
  fs.writeFileSync(OUTPUT_PATH, report)
  console.log(`\n리포트 저장 완료: ${OUTPUT_PATH}`)

  // 콘솔 요약
  console.log('\n========== 2. 커버리지 (Tier 1/2 × 3종 지표, 카테고리 존재율은 참고용) ==========')
  console.table(
    coverageRows.map((r) => ({
      구분: r.tier,
      정의: r.desc,
      고유개념: `${r.cov.uniqueCovered}/${r.cov.uniqueTotal} (${r.cov.uniquePct.toFixed(1)}%)`,
      빈도가중: `${r.cov.freqCovered}/${r.cov.freqTotal} (${r.cov.freqPct.toFixed(1)}%)`,
      기사단위: `${r.cov.articleCovered}/${r.cov.articleTotal} (${r.cov.articlePct.toFixed(1)}%)`,
    }))
  )

  console.log('\n========== 3. 히트 편중 (Tier 2 기준) ==========')
  console.log(`상위 10개 콘텐츠가 전체 히트의 ${hitConcentration.top10Pct.toFixed(1)}%를 차지`)
  console.table(sortedHits.slice(0, 10).map((h, i) => ({ 순위: i + 1, 제목: h.item.title, 카테고리: h.item.category, 히트: h.hits })))

  console.log('\n========== 5. 갭 목록 TOP 20 ==========')
  console.table(gaps.slice(0, 20).map((g, i) => ({ 순위: i + 1, 개념어: g.concept, 등장횟수: g.count, 기사예시: exampleTitleOf(g).slice(0, 40) })))

  const aliasList = classifyResults.filter((r) => r.verdict === 'ALIAS').sort((a, b) => b.count - a.count)
  const newList = classifyResults.filter((r) => r.verdict === 'NEW').sort((a, b) => b.count - a.count)
  const outList = classifyResults.filter((r) => r.verdict === 'OUT')
  const classifyTotal = classifyResults.length || 1

  console.log(`\n========== 7. 갭 분류 (상위 ${classifyResults.length}개 대상) ==========`)
  console.table([
    { 분류: 'ALIAS (표기만 다름)', 개수: aliasList.length, 비율: `${((aliasList.length / classifyTotal) * 100).toFixed(1)}%` },
    { 분류: 'NEW (신규 제작 필요)', 개수: newList.length, 비율: `${((newList.length / classifyTotal) * 100).toFixed(1)}%` },
    { 분류: 'OUT (노이즈)', 개수: outList.length, 비율: `${((outList.length / classifyTotal) * 100).toFixed(1)}%` },
  ])

  console.log('\n[ALIAS 목록] (aliases 필드 초안)')
  console.table(aliasList.map((r) => ({ 개념어: r.term, 대응한잎: r.mapsTo ?? '(미지정)', 등장횟수: r.count })))

  console.log('\n[NEW 목록] (콘텐츠 제작 우선순위)')
  console.table(
    newList.map((r) => ({
      개념어: r.term,
      추정카테고리: QUERY_TO_CONTENT_CATEGORY[r.dominantCategory] ?? r.dominantCategory ?? '미분류',
      등장횟수: r.count,
    }))
  )

  console.log('\n========== 8. ALIAS 반영 시뮬레이션 ==========')
  console.log(`ALIAS ${aliasSimulation.aliasAppliedCount}개를 매칭 완료로 가정했을 때 (Tier 1 기준):`)
  console.table([
    {
      지표: '고유 개념 커버리지',
      현재: `${aliasSimulation.before.uniqueCovered}/${aliasSimulation.before.uniqueTotal} (${aliasSimulation.before.uniquePct.toFixed(1)}%)`,
      시뮬레이션: `${aliasSimulation.after.uniqueCovered}/${aliasSimulation.after.uniqueTotal} (${aliasSimulation.after.uniquePct.toFixed(1)}%)`,
    },
    {
      지표: '빈도 가중 커버리지',
      현재: `${aliasSimulation.before.freqCovered}/${aliasSimulation.before.freqTotal} (${aliasSimulation.before.freqPct.toFixed(1)}%)`,
      시뮬레이션: `${aliasSimulation.after.freqCovered}/${aliasSimulation.after.freqTotal} (${aliasSimulation.after.freqPct.toFixed(1)}%)`,
    },
    {
      지표: '기사 단위 커버리지',
      현재: `${aliasSimulation.before.articleCovered}/${aliasSimulation.before.articleTotal} (${aliasSimulation.before.articlePct.toFixed(1)}%)`,
      시뮬레이션: `${aliasSimulation.after.articleCovered}/${aliasSimulation.after.articleTotal} (${aliasSimulation.after.articlePct.toFixed(1)}%)`,
    },
  ])
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류:', err)
  process.exit(1)
})
