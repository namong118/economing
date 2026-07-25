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
 * 실행: node scripts/analyze-content-gap.mjs [--refresh]
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
const ROOT = path.resolve(__dirname, '..')
const CACHE_DIR = path.join(__dirname, '.cache')
const CACHE_PATH = path.join(CACHE_DIR, 'keywords.json')
const OUTPUT_DIR = path.join(__dirname, 'output')
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'content-gap-report.md')

const REFRESH = process.argv.includes('--refresh')
const TARGET_ARTICLE_COUNT = 300
const BATCH_SIZE = 10

const NEWS_QUERIES = ['경제', '금리', '증시', '부동산', '환율', '물가', '투자', '세금']

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
  '경제': null,
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 .env.local에 없어요.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── 1단계: 뉴스 수집 ──────────────────────────────────────────────

async function fetchCachedNews() {
  const { data, error } = await supabase.from('news_cache').select('category, date, data')
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

const EXTRACT_SYSTEM = `다음 기사들에서 경제/금융 "개념어"만 추출해라. 기업명, 인명, 기관명, 지역명, 날짜는 제외한다. 학습 콘텐츠의 주제가 될 수 있는 일반 개념만. JSON 배열로만 응답: ["개념1","개념2",...]. 그 외 텍스트 금지.`

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
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string' && x.trim()) : []
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
        exampleTitle: batch[0]?.title ?? '',
        concepts,
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

// 조사를 제거해도 원본 형태는 그대로 살려서 함께 반환한다 (오매칭 방지, 정보 손실 방지)
function stripTrailingParticle(s) {
  for (const p of TRAILING_PARTICLES) {
    if (s.length > p.length + 1 && s.endsWith(p)) return s.slice(0, -p.length)
  }
  return null
}

// 매칭(대조)용 — 괄호 안팎, 조사 제거형까지 모두 후보로 반환
function normalizeVariants(raw) {
  const variants = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (!cleaned) continue
    variants.add(cleaned)
    const stripped = stripTrailingParticle(cleaned)
    if (stripped) variants.add(stripped)
  }
  return [...variants]
}

// 뉴스에서 뽑힌 개념어를 배치 간에 집계(그룹핑)할 때 쓰는 대표키 하나
// (괄호 바깥쪽 + 조사 제거 우선형을 대표로 삼는다)
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
  console.log('\n[정규화 샘플 20개] (원본 → 매칭용 변형들)')
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
    for (const rawConcept of batch.concepts) {
      const key = canonicalKey(rawConcept)
      if (!key) continue
      if (!agg.has(key)) {
        agg.set(key, { displayRaw: rawConcept, count: 0, categories: new Map(), exampleTitle: batch.exampleTitle })
      }
      const entry = agg.get(key)
      entry.count += 1
      entry.categories.set(batch.category, (entry.categories.get(batch.category) ?? 0) + 1)
    }
  }
  return agg
}

function dominantCategory(categoryCounts) {
  return [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

function matchAllTiers(aggMap, tier1Index, tier2Index, categoriesWithContent) {
  const results = []
  for (const entry of aggMap.values()) {
    const variants = normalizeVariants(entry.displayRaw)
    const domCat = dominantCategory(entry.categories)

    let matchTier = null
    let matchedItems = null
    let fallbackCategory = null

    for (const v of variants) {
      if (tier1Index.has(v)) {
        matchTier = 1
        matchedItems = tier1Index.get(v)
        break
      }
    }
    if (!matchTier) {
      for (const v of variants) {
        if (tier2Index.has(v)) {
          matchTier = 2
          matchedItems = tier2Index.get(v)
          break
        }
      }
    }
    if (!matchTier) {
      const mapped = QUERY_TO_CONTENT_CATEGORY[domCat] ?? null
      if (mapped && categoriesWithContent.has(mapped)) {
        matchTier = 3
        fallbackCategory = mapped
      }
    }

    results.push({
      concept: entry.displayRaw,
      count: entry.count,
      dominantCategory: domCat,
      exampleTitle: entry.exampleTitle,
      matchTier,
      matchedItems,
      fallbackCategory,
    })
  }
  return results
}

// ── 5단계: 리포트 ────────────────────────────────────────────────

function buildReport({ collectionSummary, matchRates, hitConcentration, deadStock, gaps, categorySupplyDemand }) {
  const lines = []
  lines.push('# ECONOMING 콘텐츠 갭 분석 리포트')
  lines.push('')
  lines.push(`생성 시각: ${new Date().toISOString()}`)
  lines.push('')

  lines.push('## 1. 수집 요약')
  lines.push('')
  lines.push(`- 캐시(news_cache) 기사: ${collectionSummary.cacheCount}건`)
  lines.push(`- 신규 수집(뉴스 API) 기사: ${collectionSummary.freshCount}건`)
  lines.push(`- 중복 제거 후 총 기사: ${collectionSummary.totalCount}건 (목표 ${TARGET_ARTICLE_COUNT}건${collectionSummary.totalCount < TARGET_ARTICLE_COUNT ? ' — 미달, 경고만 하고 진행함' : ''})`)
  lines.push(`- 추출된 고유 개념어 수: ${collectionSummary.uniqueConceptCount}개`)
  lines.push('')

  lines.push('## 2. 매칭률 (Tier 1/2/3)')
  lines.push('')
  lines.push('| Tier | 정의 | 매칭 개념 수 | 매칭률 |')
  lines.push('|---|---|---|---|')
  for (const r of matchRates) {
    lines.push(`| ${r.tier} | ${r.desc} | ${r.covered}/${r.total} | ${r.pct.toFixed(1)}% |`)
  }
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
  lines.push('(Tier 3 카테고리 폴백까지 적용해도 매칭되지 않은 개념만 포함 — 가장 엄격한 기준)')
  lines.push('')
  lines.push('| 순위 | 개념어 | 등장 횟수 | 기사 제목 예시 |')
  lines.push('|---|---|---|---|')
  gaps.forEach((g, i) => {
    lines.push(`| ${i + 1} | ${g.concept} | ${g.count} | ${g.exampleTitle} |`)
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

  return lines.join('\n')
}

// ── 메인 ─────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  let cached = null
  if (!REFRESH && fs.existsSync(CACHE_PATH)) {
    cached = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
    console.log(`캐시된 개념어를 재사용해요 (${cached.meta.generatedAt} 생성, --refresh로 재추출 가능)`)
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

  const total = conceptResults.length
  const tier1Covered = conceptResults.filter((c) => c.matchTier === 1).length
  const tier2Covered = conceptResults.filter((c) => c.matchTier === 1 || c.matchTier === 2).length
  const tier3Covered = conceptResults.filter((c) => c.matchTier !== null).length

  const matchRates = [
    { tier: 'Tier 1', desc: 'title 완전 일치만', covered: tier1Covered, total, pct: total ? (tier1Covered / total) * 100 : 0 },
    { tier: 'Tier 2', desc: 'Tier 1 + relatedTerms', covered: tier2Covered, total, pct: total ? (tier2Covered / total) * 100 : 0 },
    { tier: 'Tier 3', desc: 'Tier 2 + category 폴백', covered: tier3Covered, total, pct: total ? (tier3Covered / total) * 100 : 0 },
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

  const gaps = conceptResults
    .filter((c) => c.matchTier === null)
    .sort((a, b) => b.count - a.count)
    .slice(0, 40)

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

  const report = buildReport({ collectionSummary, matchRates, hitConcentration, deadStock, gaps, categorySupplyDemand })
  fs.writeFileSync(OUTPUT_PATH, report)
  console.log(`\n리포트 저장 완료: ${OUTPUT_PATH}`)

  // 콘솔 요약 (2, 3, 5번)
  console.log('\n========== 2. 매칭률 ==========')
  console.table(matchRates.map((r) => ({ Tier: r.tier, 정의: r.desc, 매칭: `${r.covered}/${r.total}`, 매칭률: `${r.pct.toFixed(1)}%` })))

  console.log('\n========== 3. 히트 편중 (Tier 2 기준) ==========')
  console.log(`상위 10개 콘텐츠가 전체 히트의 ${hitConcentration.top10Pct.toFixed(1)}%를 차지`)
  console.table(sortedHits.slice(0, 10).map((h, i) => ({ 순위: i + 1, 제목: h.item.title, 카테고리: h.item.category, 히트: h.hits })))

  console.log('\n========== 5. 갭 목록 TOP 40 ==========')
  console.table(gaps.map((g, i) => ({ 순위: i + 1, 개념어: g.concept, 등장횟수: g.count, 기사예시: g.exampleTitle?.slice(0, 40) })))
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류:', err)
  process.exit(1)
})
