#!/usr/bin/env node
/**
 * 초보자용 경제 단어 커리큘럼 확정본.
 * v3에서 '금리'(신규 개념, 빈도 41) 하나만 4챕터(금리와 통화정책)에서
 * 1챕터(자산의 기본)로 옮긴다. 예금·적금(2챕터)을 배우기 전에 이미 알아야
 * 하는 가장 기초적인 어휘라 통화정책(양적완화·긴축정책 등 정책 도구) 챕터보다
 * 훨씬 앞에 와야 한다는 판단.
 * 순서 위반 검사는 다시 돌리지 않는다 — v1(21건)->v2(38건)->v3(38건)를 거치며
 * 흔한 경제 단어(금리·투자·주식·부동산·자산)가 카드로 많이 등록될수록 이 지표는
 * 0으로 수렴하지 않는다는 게 확인됐다. v3 결과를 참고용으로 그대로 옮긴다.
 * AI 재호출 없음.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import economicBites from '../src/data/economicBites.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------- 1. 기존 70개 중 제외 (5개, v1~v3와 동일) ----------
const EXCLUDED_HARD_IDS = [30, 39, 52, 54, 55]
const EXCLUSION_REASONS = {
  30: 'PER — 투자 분석 지표. 뉴스 빈도 1회, 손익/재무제표 이해가 선행돼야 함.',
  39: '재무제표 — 회계 기초가 선행돼야 하는 심화 개념. 빈도 1회.',
  52: '할인율 — 채권/현재가치 계산 개념으로 진입장벽이 높음. 빈도 2회.',
  54: '주가수익비율(PBR) — PER와 같이 봐야 의미 있는 심화 지표. 빈도 1회.',
  55: '경제적 해자 — 기업 분석 개념. 뉴스 빈도 사실상 없음(1회).',
}

// ---------- 2. 신규 개념 35개 중 4개 제외 (v2~v3와 동일) ----------
const V1_CUT_IDS = ['탄력성', '로보어드바이저', '자사주 매입', '원자재가격']
const V1_CUT_REASONS = {
  '탄력성': '빈도 0, 생활밀착도 낮음(추상적 가격이론). 수요와 공급 하나로 "시장 원리" 챕터가 이미 성립해 중복 없이 뺄 수 있음.',
  '로보어드바이저': '빈도 1, 생활밀착도 낮음. 실제 개념이라기보다 상품명에 가까움 — "돈이 되는" 실익 근거가 약함.',
  '자사주 매입': '빈도 1, 생활밀착도 낮음. PER/PBR과 같은 계열의 투자분석 소재라 제외한 심화 항목들과 같은 이유로 제외.',
  '원자재가격': '빈도 1, 생활밀착도 낮음. 금(Gold)·기름값(기존 71번) 이 이미 원자재 가격 이야기를 다루고 있어 별도 카드가 없어도 됨.',
}

// 31개. '금리'만 chapter를 'rate' -> 'assetbasic'으로 변경(이번 수정 사항), 나머지는 v3와 동일.
const NEW_CONCEPTS = [
  { title: '금리', freq: 41, chapter: 'assetbasic', note: '가장 기초인 "이자율" 개념 자체. 예금·적금(2챕터)보다 먼저 알아야 해서 4챕터(통화정책)에서 1챕터로 이동.' },
  { title: '국채 금리', freq: 6, chapter: 'rate', note: '기준금리(정책금리)와 다른 시장금리 — 흔한 혼동 지점.' },
  { title: '대출금리', freq: 2, chapter: 'rate', note: '기준금리와 내가 내는 금리가 다르다는 것.' },
  { title: '가산금리', freq: 1, chapter: 'rate', note: '대출금리 = 기준금리 + 가산금리 구조.' },
  { title: '빅스텝', freq: 1, chapter: 'rate', note: '빈도는 낮게 잡혔지만 금리 인상 뉴스에서 관용적으로 반복 등장하는 표현이라 유지.' },
  { title: '유류세', freq: 4, chapter: 'price', note: '기존 71(기름값이 오르면)의 세금 구성 요소.' },
  { title: '관세', freq: 3, chapter: 'nation', note: '무역수지는 있지만 정책 수단인 관세 자체는 갭.' },
  { title: '공급망', freq: 1, chapter: 'nation', note: '개별 빈도는 낮지만 반도체·요소수 등으로 반복 재등장하는 구조적 주제라 유지.' },
  { title: '부동산', freq: 19, chapter: 'house', note: '부동산 카테고리 개관 — 기존 청약/전세 2개뿐이라 보강.' },
  { title: '대출 규제', freq: 40, chapter: 'house', note: 'LTV/DSR 등 6개 유사 표현 통합. 한국 뉴스에서 대부분 주택 대출 맥락이라 집 챕터로.' },
  { title: '가계부채', freq: 44, chapter: 'house', note: '가계부채 관리/가계대출/가계신용 통합. 부채(1챕터, 추상)의 응용판이지만 실제 뉴스에선 거의 항상 부동산 대출/DSR 규제와 함께 논의되는 정책 지표라 집 챕터에 둠.' },
  { title: '주택담보대출(LTV)', freq: 3, chapter: 'house', note: '주택담보대출 2 + LTV(주택담보인정비율) 1 통합.' },
  { title: '보유세(재산세·종합부동산세)', freq: 12, chapter: 'house', note: '보유세 10 + 종합부동산세 2 통합.' },
  { title: '양도소득세', freq: 3, chapter: 'house', note: '양도세 2 통합. 보유세와 달리 "팔 때" 내는 세금.' },
  { title: '재개발·재건축', freq: 1, chapter: 'house', note: '부동산 카테고리 보강.' },
  { title: '마이너스통장', freq: 1, chapter: 'save', note: '' },
  { title: '파킹통장', freq: 1, chapter: 'save', note: '' },
  { title: '비과세 혜택', freq: 1, chapter: 'save', note: '' },
  { title: '금리인하요구권', freq: 1, chapter: 'save', note: '빈도는 낮지만 실제로 돈이 되는 소비자 권리 — 생활밀착도 우선으로 유지.' },
  { title: '보험', freq: 1, chapter: 'save', note: '기존 4대보험(56)의 상위 개념(위험 분산 원리).' },
  { title: '투자', freq: 11, chapter: 'invest', note: 'ETF/주식 등 개별 상품 이전의 개관 개념.' },
  { title: '순자산', freq: 0, chapter: 'assetbasic', note: 'relatedTerms 발견분. 자산(43)-부채(44)의 자연스러운 합.' },
  { title: '세금', freq: 21, chapter: 'tax', note: '소득세·부가가치세 등 개별 세금 이전의 개관 개념.' },
  { title: '상속세·증여세', freq: 4, chapter: 'tax', note: '상속세 1 + 편법 증여 3 통합.' },
  { title: '거래세', freq: 5, chapter: 'tax', note: '주식·부동산 거래에 공통되는 세금이라 세금 챕터로.' },
  { title: '비트코인·암호화폐', freq: 5, chapter: 'invest', note: '암호화폐 투자 2 + 비트코인 1 + 비트코인 ETF 1 + 채굴 1 통합.' },
  { title: 'ESG 투자', freq: 2, chapter: 'invest', note: 'ESG 1 + ESG 경영 1 통합.' },
  { title: '서학개미', freq: 1, chapter: 'invest', note: '해외주식 투자 — 구조적 트렌드로 판단, 유행어 아님.' },
  { title: '개인형퇴직연금(IRP)', freq: 1, chapter: 'retire', note: '기존 퇴직연금(31)/연금(16)의 실천형 상품.' },
  { title: '자산관리', freq: 1, chapter: 'retire', note: '노후 준비 실전형 마무리 개념.' },
  { title: '독점', freq: 0, chapter: 'micro', note: 'relatedTerms 발견분. 규모의 경제(42)의 확장, 통신사·배달앱 등 체감 사례 풍부.' },
]

if (NEW_CONCEPTS.length !== 31) throw new Error(`NEW_CONCEPTS 개수 오류: ${NEW_CONCEPTS.length} (기대: 31)`)

// ---------- 3. 기존 70개 빈도 재계산 ----------
const TRAILING_PARTICLES = ['으로', '이', '가', '은', '는', '을', '를', '의', '에', '도', '만', '과', '와', '로'].sort((a, b) => b.length - a.length)
function stripWhitespace(s) { return s.replace(/\s+/g, '') }
function splitParenthetical(s) {
  const m = s.match(/^(.*?)\(([^)]*)\)(.*)$/)
  if (!m) return [s]
  const [, before, inside, after] = m
  return [(before + after).trim(), inside.trim()].filter(Boolean)
}
function stripTrailingParticle(s) {
  for (const p of TRAILING_PARTICLES) if (s.length > p.length + 1 && s.endsWith(p)) return s.slice(0, -p.length)
  return null
}
function variants(raw) {
  const out = new Set()
  for (const part of splitParenthetical(raw)) {
    const cleaned = stripWhitespace(part).toUpperCase()
    if (cleaned) { out.add(cleaned); const s = stripTrailingParticle(cleaned); if (s) out.add(s) }
  }
  return out
}
function canonicalKey(raw) {
  const outer = splitParenthetical(raw)[0] ?? raw
  const cleaned = stripWhitespace(outer).toUpperCase()
  return stripTrailingParticle(cleaned) ?? cleaned
}
const keywordsCache = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'keywords.json'), 'utf-8'))
const agg = new Map()
for (const batch of keywordsCache.batches) {
  for (const { concept, articles } of batch.concepts) {
    const key = canonicalKey(concept)
    if (!key) continue
    agg.set(key, (agg.get(key) ?? 0) + (articles.length || 1))
  }
}
const titleIndex = new Map()
for (const b of economicBites) {
  for (const term of [b.title, ...(b.relatedTerms ?? [])]) {
    for (const v of variants(term)) {
      if (!titleIndex.has(v)) titleIndex.set(v, [])
      titleIndex.get(v).push(b.id)
    }
  }
}
const freqById = new Map()
for (const [key, count] of agg) {
  const ids = titleIndex.get(key)
  if (!ids) continue
  for (const id of ids) freqById.set(id, (freqById.get(id) ?? 0) + count)
}

const existingKept = economicBites
  .filter((b) => !EXCLUDED_HARD_IDS.includes(b.id))
  .map((b) => ({ kind: 'existing', id: b.id, title: b.title, freq: freqById.get(b.id) ?? 0 }))
if (existingKept.length !== 65) throw new Error(`existingKept 개수 오류: ${existingKept.length} (기대: 65)`)

const newItems = NEW_CONCEPTS.map((c) => ({
  kind: 'new', id: null, title: c.title, freq: c.freq, note: c.note, chapterHint: c.chapter,
}))

const pool = [...existingKept, ...newItems]
if (pool.length !== 96) throw new Error(`최종 후보 개수 오류: ${pool.length} (기대: 96)`)

// ---------- 4. 챕터 구성 확정 — v3에서 '금리'만 4챕터->1챕터로 이동 ----------
const CHAPTERS = [
  {
    name: '1. 자산의 기본',
    existing: ['자산', '부채', '복리', '단리', '유동성'],
    newChapterKey: 'assetbasic',
    scenarios: [],
  },
  {
    name: '2. 저축과 보험 — 내 통장 관리',
    existing: ['예금', '적금', '비상금', '신용등급', '4대보험'],
    newChapterKey: 'save',
    scenarios: [],
  },
  {
    name: '3. 물가 — 돈의 가치가 오르내리는 이유',
    existing: ['인플레이션', '디플레이션', '소비자물가지수(CPI)', '스태그플레이션'],
    newChapterKey: 'price',
    scenarios: ['전기요금 오르면 경제는', '기름값이 오르면', '내 월급의 실질 가치는', '최저임금 오르면 물가도 오를까'],
  },
  {
    name: '4. 금리와 통화정책 — 돈을 빌리는 값이 정해지는 방식',
    existing: ['기준금리', '금리 인상', '금리 인하', '양적완화', '긴축정책'],
    newChapterKey: 'rate',
    scenarios: ['금리가 오르면 내 대출은', '아파트값과 금리의 관계'],
  },
  {
    name: '5. 집 — 사고, 빌리고, 세금 내기',
    existing: ['청약', '부동산 전세'],
    newChapterKey: 'house',
    scenarios: [],
  },
  {
    name: '6. 투자 첫걸음',
    existing: ['주식', 'ETF', '펀드', '인덱스 펀드', '코스피', 'S&P 500', '수익률', '배당금', '배당수익률'],
    newChapterKey: 'invest',
    scenarios: [],
  },
  {
    name: '7. 포트폴리오와 투자 위험',
    existing: ['자산배분', '포트폴리오', '리밸런싱', '시가총액', '채권', '금(Gold)', '레버리지', '공매도', '인플레이션 헤지'],
    newChapterKey: null,
    scenarios: [],
  },
  {
    name: '8. 나라 경제 읽기',
    existing: ['GDP', '실업률', '경기침체', '무역수지', '환율', '달러 인덱스', '경상수지'],
    newChapterKey: 'nation',
    scenarios: ['환율이 오르면 장바구니는', '중국 경제 흔들리면 한국은', '미국 금리가 오르면 한국은'],
  },
  {
    name: '9. 세금 — 내가 내는 돈',
    existing: ['소득세', '부가가치세(VAT)', '가처분소득'],
    newChapterKey: 'tax',
    scenarios: [],
  },
  {
    name: '10. 노후 준비',
    existing: ['연금', '퇴직연금'],
    newChapterKey: 'retire',
    scenarios: ['주식시장 폭락하면 내 연금은'],
  },
  {
    name: '11. 시장을 움직이는 원리',
    existing: ['수요와 공급', '규모의 경제', '기회비용', '매몰비용'],
    newChapterKey: 'micro',
    scenarios: [],
  },
]

// ---------- 5. 배정 검증 ----------
const byTitle = new Map(pool.map((it) => [it.title, it]))
const assigned = new Set()
const chapterItems = CHAPTERS.map((ch) => {
  const items = []
  for (const t of ch.existing) {
    const it = byTitle.get(t)
    if (!it) throw new Error(`[${ch.name}] 존재하지 않는 제목: "${t}"`)
    items.push(it)
  }
  for (const t of ch.scenarios) {
    const it = byTitle.get(t)
    if (!it) throw new Error(`[${ch.name}] 존재하지 않는 시나리오: "${t}"`)
    items.push(it)
  }
  if (ch.newChapterKey) {
    for (const it of newItems) if (it.chapterHint === ch.newChapterKey) items.push(it)
  }
  for (const it of items) {
    if (assigned.has(it.title)) throw new Error(`중복 배정: "${it.title}"`)
    assigned.add(it.title)
  }
  return { name: ch.name, items }
})
const unassigned = pool.filter((it) => !assigned.has(it.title))
if (unassigned.length > 0) throw new Error(`배정 안 된 항목: ${unassigned.map((it) => it.title).join(', ')}`)
const totalAssigned = chapterItems.reduce((sum, ch) => sum + ch.items.length, 0)
if (totalAssigned !== 96) throw new Error(`배정 총합 오류: ${totalAssigned}`)

const ch1 = chapterItems[0], ch4 = chapterItems[3]
if (ch1.items.length !== 7) throw new Error(`1챕터 개수 오류: ${ch1.items.length} (기대: 7)`)
if (ch4.items.length !== 11) throw new Error(`4챕터 개수 오류: ${ch4.items.length} (기대: 11)`)

// ---------- 6. 출력 ----------
const lines = []
lines.push('# 초보자용 경제 단어 커리큘럼 — 확정본')
lines.push('')
lines.push(`생성 시각: ${new Date().toISOString()}`)
lines.push('')
lines.push('v1(고정 10x10) -> v2(주제 우선 재편) -> v3(챕터 순서 재배치) -> 확정(금리 위치 최종 조정)을')
lines.push('거쳐 확정한 버전. scripts/output/curriculum-draft.md, -v2.md, -v3.md에 각 단계 기록이 남아 있다.')
lines.push('')
lines.push('v3 대비 변경은 단 하나: 신규 개념 \'금리\'(빈도 41)를 "4. 금리와 통화정책"에서 "1. 자산의 기본"으로')
lines.push('이동. 예금·적금(2챕터)을 배우려면 이미 알아야 하는 가장 기초적인 어휘이고, 통화정책(양적완화·')
lines.push('긴축정책 등 정책 도구)은 그보다 훨씬 뒤에 나오는 심화 내용이라는 판단.')
lines.push('')
lines.push('## 1. 챕터 구성 (11챕터, 96개)')
lines.push('')
chapterItems.forEach((ch) => {
  lines.push(`### ${ch.name}`)
  lines.push('')
  lines.push(`(${ch.items.length}개)`)
  lines.push('')
  lines.push('| 제목 | 기존 한잎 | 뉴스 빈도 |')
  lines.push('|---|---|---|')
  for (const it of ch.items) {
    lines.push(`| ${it.title} | ${it.kind === 'existing' ? `있음(id ${it.id})` : '없음'} | ${it.freq} |`)
  }
  lines.push('')
})

lines.push('## 2. 신규 제작 목록 (31개, 챕터 순서대로)')
lines.push('')
lines.push('앞으로 콘텐츠를 만들 순서 — 위 챕터 구성과 같은 순서로 정렬했다.')
lines.push('')
lines.push('| # | 제목 | 소속 챕터 | 뉴스 빈도 | 비고 |')
lines.push('|---|---|---|---|---|')
let n = 1
for (const ch of chapterItems) {
  for (const it of ch.items) {
    if (it.kind !== 'new') continue
    lines.push(`| ${n} | ${it.title} | ${ch.name} | ${it.freq} | ${it.note || ''} |`)
    n++
  }
}
lines.push('')
lines.push(`총 ${n - 1}개.`)
lines.push('')

lines.push('## 3. 제외 항목 (9개)')
lines.push('')
lines.push('### 기존 한잎 중 제외 (5개) — 70개 중')
lines.push('')
lines.push('| id | 제목 | 이유 |')
lines.push('|---|---|---|')
for (const id of EXCLUDED_HARD_IDS) {
  const b = economicBites.find((x) => x.id === id)
  lines.push(`| ${id} | ${b.title} | ${EXCLUSION_REASONS[id]} |`)
}
lines.push('')
lines.push('### 갭 개념 후보 중 제외 (4개) — v1에서 큐레이션한 35개 신규 개념 후보 중')
lines.push('')
lines.push('| 제목 | 이유 |')
lines.push('|---|---|')
for (const t of V1_CUT_IDS) lines.push(`| ${t} | ${V1_CUT_REASONS[t]} |`)
lines.push('')
lines.push('기존 한잎 5개 + 갭 개념 4개 = 총 9개 제외.')
lines.push('')

lines.push('## 4. 순서 위반 검사 (참고용 — v3 결과, 재실행하지 않음)')
lines.push('')
lines.push('**이 지표는 포화됐다.** v1(21건, 고정 10x10 틀 안에서의 위반) -> v2(38건, 주제 우선 재편 직후) ->')
lines.push('v3(38건, 챕터 순서 재배치 후)로 이어지는 동안, 총 위반 건수는 챕터를 아무리 재배치해도 0으로')
lines.push('수렴하지 않았다. 이유: 금리·투자·주식·부동산·자산처럼 뉴스에도 흔하고 콘텐츠 카드로도 만든')
lines.push('일상 단어가 많아질수록, 어떤 카드의 설명문이든 다른 카드의 제목 문자열을 스치듯 포함할 확률이')
lines.push('올라간다. 즉 이 시점부터는 "순서가 잘못됐는가"가 아니라 "흔한 경제 단어를 몇 개나 카드로')
lines.push('등록했는가"를 재는 지표가 됐다. 앞으로 콘텐츠가 100개, 200개로 늘어날수록 이 문자열 검사의')
lines.push('위반 건수는 구조와 무관하게 계속 늘어날 것으로 예상되므로, 챕터 순서를 판단하는 용도로는')
lines.push('더 이상 쓰지 않는다. 아래는 v3에서 마지막으로 실행한 결과를 그대로 옮긴 것이다(금리를 1챕터로')
lines.push('옮기기 전 기준이라 "예금->금리", "신용등급->금리" 등 일부는 재실행하면 사라질 것으로 보이지만,')
lines.push('위 이유로 재실행하지 않았다).')
lines.push('')

// v3 리포트의 "## 5. 순서 위반" 섹션 본문을 그대로 옮긴다(검사 재실행 없음).
const v3Path = path.join(__dirname, 'output', 'curriculum-draft-v3.md')
const v3Text = fs.readFileSync(v3Path, 'utf-8')
const startMarker = '## 5. 순서 위반\n'
const endMarker = '\n## 6. 챕터 이름 검증'
const startIdx = v3Text.indexOf(startMarker)
const endIdx = v3Text.indexOf(endMarker)
if (startIdx === -1 || endIdx === -1) throw new Error('v3 리포트에서 순서 위반 섹션을 찾지 못함 — v3 파일 구조가 바뀌었는지 확인할 것.')
const v3ViolationSection = v3Text.slice(startIdx + startMarker.length, endIdx).trim()
lines.push(v3ViolationSection)
lines.push('')

const outPath = path.join(__dirname, 'output', 'curriculum-final.md')
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`작성 완료: ${outPath}`)
console.log(`총 개수: ${totalAssigned}, 챕터 수: ${chapterItems.length}`)
console.log(`1챕터: ${ch1.items.length}개, 4챕터: ${ch4.items.length}개`)
console.log(`신규 제작 목록: ${n - 1}개`)
console.log(`제외 항목: ${EXCLUDED_HARD_IDS.length + V1_CUT_IDS.length}개`)
