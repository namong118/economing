#!/usr/bin/env node
/**
 * 초보자용 경제 단어 커리큘럼 초안 v2.
 * v1(고정 10x10)의 문제 3가지를 고쳐서 다시 짠다:
 *   - 응용 시나리오(id 71~80)가 전제 개념보다 앞에 오는 문제 -> 각 챕터의 "맨 뒤"로 이동
 *   - 챕터 이름이 내용과 안 맞는 문제 -> 주제 덩어리를 먼저 잡고 이름을 그 다음에 붙임
 *   - 정원 채우기 문제 -> 개수를 고정하지 않고 빈도+생활밀착도 낮은 신규 개념 4개를 제외
 * 챕터 배정은 정렬 알고리즘이 아니라 수작업 큐레이션(주제별)이며, 스크립트는
 * "빠짐/중복 없이 정확히 배정됐는가"만 코드로 검증한다. AI 재호출 없음.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import economicBites from '../src/data/economicBites.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------- 1. 기존 70개 중 제외 (v1과 동일 — 재검토 결과 변경 사유 없음) ----------
const EXCLUDED_HARD_IDS = [30, 39, 52, 54, 55]
const EXCLUSION_REASONS = {
  30: 'PER — 투자 분석 지표. 뉴스 빈도 1회, 손익/재무제표 이해가 선행돼야 함.',
  39: '재무제표 — 회계 기초가 선행돼야 하는 심화 개념. 빈도 1회.',
  52: '할인율 — 채권/현재가치 계산 개념으로 진입장벽이 높음. 빈도 2회.',
  54: '주가수익비율(PBR) — PER와 같이 봐야 의미 있는 심화 지표. 빈도 1회.',
  55: '경제적 해자 — 기업 분석 개념. 뉴스 빈도 사실상 없음(1회).',
}

// ---------- 2. v1의 신규 개념 35개 중 4개 추가 제외 (정원 채우기 방지) ----------
const V1_CUT_IDS = ['탄력성', '로보어드바이저', '자사주 매입', '원자재가격']
const V1_CUT_REASONS = {
  '탄력성': '빈도 0, 생활밀착도 낮음(추상적 가격이론). 수요와 공급 하나로 "시장 원리" 챕터가 이미 성립해 중복 없이 뺄 수 있음.',
  '로보어드바이저': '빈도 1, 생활밀착도 낮음. 실제 개념이라기보다 상품명에 가까움 — "돈이 되는" 실익 근거가 약함.',
  '자사주 매입': '빈도 1, 생활밀착도 낮음. PER/PBR과 같은 계열의 투자분석 소재라 제외한 심화 항목들과 같은 이유로 제외.',
  '원자재가격': '빈도 1, 생활밀착도 낮음. 금(Gold)·기름값(기존 71번) 이 이미 원자재 가격 이야기를 다루고 있어 별도 카드가 없어도 됨.',
}

// v1 35개 중 위 4개를 뺀 31개. title, freq, note, chapter(소속 챕터 key)
const NEW_CONCEPTS = [
  { title: '금리', freq: 41, chapter: 'rate', note: '기준금리보다 더 기초인 "이자율" 개념 자체. 최상위 빈도.' },
  { title: '국채 금리', freq: 6, chapter: 'rate', note: '기준금리(정책금리)와 다른 시장금리 — 흔한 혼동 지점.' },
  { title: '대출금리', freq: 2, chapter: 'rate', note: '기준금리와 내가 내는 금리가 다르다는 것.' },
  { title: '가산금리', freq: 1, chapter: 'rate', note: '대출금리 = 기준금리 + 가산금리 구조.' },
  { title: '빅스텝', freq: 1, chapter: 'rate', note: '빈도는 낮게 잡혔지만 금리 인상 뉴스에서 관용적으로 반복 등장하는 표현이라 유지.' },
  { title: '유류세', freq: 4, chapter: 'price', note: '기존 71(기름값이 오르면)의 세금 구성 요소.' },
  { title: '관세', freq: 3, chapter: 'nation', note: '무역수지는 있지만 정책 수단인 관세 자체는 갭.' },
  { title: '공급망', freq: 1, chapter: 'nation', note: '개별 빈도는 낮지만 반도체·요소수 등으로 반복 재등장하는 구조적 주제라 유지.' },
  { title: '부동산', freq: 19, chapter: 'house', note: '부동산 카테고리 개관 — 기존 청약/전세 2개뿐이라 보강.' },
  { title: '대출 규제', freq: 40, chapter: 'house', note: 'LTV/DSR 등 6개 유사 표현 통합. 한국 뉴스에서 대부분 주택 대출 맥락이라 집 챕터로.' },
  { title: '가계부채', freq: 44, chapter: 'house', note: '가계부채 관리/가계대출/가계신용 통합.' },
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
  { title: '비트코인·암호화폐', freq: 5, chapter: 'newinvest', note: '암호화폐 투자 2 + 비트코인 1 + 비트코인 ETF 1 + 채굴 1 통합.' },
  { title: 'ESG 투자', freq: 2, chapter: 'newinvest', note: 'ESG 1 + ESG 경영 1 통합.' },
  { title: '서학개미', freq: 1, chapter: 'newinvest', note: '해외주식 투자 — 구조적 트렌드로 판단, 유행어 아님.' },
  { title: '개인형퇴직연금(IRP)', freq: 1, chapter: 'newinvest', note: '기존 퇴직연금(31)/연금(16)의 실천형 상품.' },
  { title: '자산관리', freq: 1, chapter: 'newinvest', note: '노후 준비 실전형 마무리 개념.' },
  { title: '독점', freq: 0, chapter: 'micro', note: 'relatedTerms 발견분. 규모의 경제(42)의 확장, 통신사·배달앱 등 체감 사례 풍부.' },
]

if (NEW_CONCEPTS.length !== 31) throw new Error(`NEW_CONCEPTS 개수 오류: ${NEW_CONCEPTS.length} (기대: 31)`)

// ---------- 3. 기존 70개 빈도 재계산 (v1과 동일 로직) ----------
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
  .map((b) => ({
    kind: 'existing', id: b.id, title: b.title, difficulty: b.difficulty,
    freq: freqById.get(b.id) ?? 0,
    body: `${b.description ?? ''} ${b.whyImportant ?? ''}`,
  }))
if (existingKept.length !== 65) throw new Error(`existingKept 개수 오류: ${existingKept.length} (기대: 65)`)

const newItems = NEW_CONCEPTS.map((c) => ({
  kind: 'new', id: null, title: c.title, difficulty: null, freq: c.freq, body: '', note: c.note, chapterHint: c.chapter,
}))

const pool = [...existingKept, ...newItems]
if (pool.length !== 96) throw new Error(`최종 후보 개수 오류: ${pool.length} (기대: 96)`)

// ---------- 4. 챕터 구성 (수작업 큐레이션 — 주제 우선, 순서는 "일상 -> 국내/국제 -> 이론") ----------
// existing: 기존 한잎 title 배열, scenarios: id71~80 시나리오는 반드시 배열 맨 끝
const CHAPTERS = [
  {
    name: '1. 금리와 통화정책 — 돈을 빌리는 값이 정해지는 방식',
    existing: ['기준금리', '금리 인상', '금리 인하', '양적완화', '긴축정책'],
    newChapterKey: 'rate',
    scenarios: ['금리가 오르면 내 대출은', '아파트값과 금리의 관계'],
  },
  {
    name: '2. 물가 — 돈의 가치가 오르내리는 이유',
    existing: ['인플레이션', '디플레이션', '소비자물가지수(CPI)', '스태그플레이션'],
    newChapterKey: 'price',
    scenarios: ['전기요금 오르면 경제는', '기름값이 오르면', '내 월급의 실질 가치는', '최저임금 오르면 물가도 오를까'],
  },
  {
    name: '3. 집 — 사고, 빌리고, 세금 내기',
    existing: ['청약', '부동산 전세'],
    newChapterKey: 'house',
    scenarios: [],
  },
  {
    name: '4. 저축과 보험 — 내 통장 관리',
    existing: ['예금', '적금', '비상금', '신용등급', '4대보험'],
    newChapterKey: 'save',
    scenarios: [],
  },
  {
    name: '5. 투자 첫걸음',
    existing: ['주식', 'ETF', '펀드', '인덱스 펀드', '코스피', 'S&P 500', '수익률', '배당금', '배당수익률'],
    newChapterKey: 'invest',
    scenarios: [],
  },
  {
    name: '6. 자산의 기본',
    existing: ['자산', '부채', '복리', '단리', '유동성'],
    newChapterKey: 'assetbasic',
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
    name: '10. 새로운 투자와 노후 준비',
    existing: ['연금', '퇴직연금'],
    newChapterKey: 'newinvest',
    scenarios: ['주식시장 폭락하면 내 연금은'],
  },
  {
    name: '11. 시장을 움직이는 원리',
    existing: ['수요와 공급', '규모의 경제', '기회비용', '매몰비용'],
    newChapterKey: 'micro',
    scenarios: [],
  },
]

// ---------- 5. 배정 검증 (코드) ----------
const byTitle = new Map(pool.map((it) => [it.title, it]))
const assigned = new Set()
const chapterItems = CHAPTERS.map((ch) => {
  const items = []
  for (const t of ch.existing) {
    const it = byTitle.get(t)
    if (!it) throw new Error(`[${ch.name}] 존재하지 않는 제목: "${t}"`)
    if (it.kind !== 'existing') throw new Error(`[${ch.name}] "${t}"는 existing이 아님`)
    items.push(it)
  }
  for (const t of ch.scenarios) {
    const it = byTitle.get(t)
    if (!it) throw new Error(`[${ch.name}] 존재하지 않는 시나리오: "${t}"`)
    items.push(it)
  }
  if (ch.newChapterKey) {
    for (const it of newItems) {
      if (it.chapterHint === ch.newChapterKey) items.push(it)
    }
  }
  for (const it of items) {
    if (assigned.has(it.title)) throw new Error(`중복 배정: "${it.title}"`)
    assigned.add(it.title)
  }
  return { name: ch.name, items }
})

const unassigned = pool.filter((it) => !assigned.has(it.title))
if (unassigned.length > 0) {
  throw new Error(`배정 안 된 항목 ${unassigned.length}개: ${unassigned.map((it) => it.title).join(', ')}`)
}
const totalAssigned = chapterItems.reduce((sum, ch) => sum + ch.items.length, 0)
if (totalAssigned !== 96) throw new Error(`배정 총합 오류: ${totalAssigned} (기대: 96)`)

// ---------- 6. 순서 위반 검사 (코드 전용) ----------
const chapterOfTitle = new Map()
chapterItems.forEach((ch, idx) => {
  for (const item of ch.items) chapterOfTitle.set(item.title, idx)
})

function findMatches(title, text) {
  if (!text) return []
  const shortTitleThreshold = 2
  const forms = splitParenthetical(title).map(stripWhitespace).filter((s) => s.length > 0)
  const hits = []
  for (const form of forms) {
    if (form.length <= shortTitleThreshold) {
      const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const boundaryBefore = '(^|[\\s,.·()\\[\\]"\'!?])'
      const boundaryAfter = '($|[\\s,.·()\\[\\]"\'!?이가은는을를의에도만과와로])'
      const re = new RegExp(boundaryBefore + '(' + escaped + ')' + boundaryAfter)
      const m = re.exec(text)
      if (m) hits.push({ form, index: m.index + m[1] !== undefined ? text.indexOf(form, m.index) : m.index })
    } else {
      const idx = text.indexOf(form)
      if (idx !== -1) hits.push({ form, index: idx })
    }
  }
  return hits
}

const violations = []
for (const item of existingKept) {
  const myChapter = chapterOfTitle.get(item.title)
  if (myChapter === undefined) continue
  for (const other of pool) {
    if (other.title === item.title) continue
    const otherChapter = chapterOfTitle.get(other.title)
    if (otherChapter === undefined || otherChapter <= myChapter) continue
    const hits = findMatches(other.title, item.body)
    if (hits.length > 0) {
      const idx = hits[0].index
      const snippet = item.body.slice(Math.max(0, idx - 20), idx + hits[0].form.length + 20).trim()
      violations.push({
        from: item.title, fromChapter: myChapter + 1,
        mentions: other.title, mentionsChapter: otherChapter + 1,
        snippet,
      })
    }
  }
}

// v1에서 시나리오 관련 위반 6건이 규칙 C 적용 후 사라졌는지 확인
const scenarioTitles = new Set(['기름값이 오르면', '환율이 오르면 장바구니는', '아파트값과 금리의 관계', '최저임금 오르면 물가도 오를까', '전기요금 오르면 경제는', '주식시장 폭락하면 내 연금은', '중국 경제 흔들리면 한국은', '미국 금리가 오르면 한국은', '내 월급의 실질 가치는', '금리가 오르면 내 대출은'])
const scenarioViolations = violations.filter((v) => scenarioTitles.has(v.from))

// 오탐 의심 / 실제 검토 필요 분류 — 38건 각각의 본문 스니펫을 직접 읽고 판단한 결과.
// 기준: 그 단어가 인과관계·정의의 핵심으로 쓰였으면 실제검토필요, "대출 이자, 예금 이자, 주식 시장,
// 부동산 가격까지" 식으로 영향 범위를 나열하거나 일반명사로 스쳐 지나가면 오탐의심.
const MANUAL_CLASSIFICATION = {
  '디플레이션|경기침체': '실제검토필요', // "디플레이션은 경기침체의 신호예요" — 직접적 인과 정의
  '금리 인하|채권': '실제검토필요', // "금리 인하 시기에는 채권 가격이 오르고" — 금리·채권가 역상관은 핵심 개념 관계
  '긴축정책|인플레이션': '실제검토필요', // "인플레이션을 잡기 위해 긴축에 나선 것" — 긴축정책의 존재 이유 자체
  '기름값이 오르면|무역수지': '실제검토필요', // "무역수지 적자가 커지고" — 구체적 인과 주장

  '기준금리|부동산': '오탐의심', '기준금리|주식': '오탐의심', '기준금리|예금': '오탐의심', '기준금리|투자': '오탐의심',
  '인플레이션|투자': '오탐의심', '디플레이션|투자': '오탐의심',
  '배당금|복리': '오탐의심', '배당금|자산': '오탐의심',
  '예금|투자': '오탐의심', '비상금|주식': '오탐의심', '비상금|투자': '오탐의심', '비상금|자산': '오탐의심',
  '양적완화|주식': '오탐의심', '양적완화|자산': '오탐의심', '양적완화|부동산': '오탐의심',
  '인덱스 펀드|복리': '오탐의심',
  '금리 인상|주식': '오탐의심', '금리 인상|예금': '오탐의심', '금리 인상|수익률': '오탐의심', '금리 인상|부동산': '오탐의심',
  '금리 인하|주식': '오탐의심', '금리 인하|자산': '오탐의심', '금리 인하|부동산': '오탐의심', '금리 인하|투자': '오탐의심',
  '소득세|개인형퇴직연금(IRP)': '오탐의심',
  '긴축정책|주식': '오탐의심', '긴축정책|부채': '오탐의심', '긴축정책|부동산': '오탐의심',
  '아파트값과 금리의 관계|부동산': '오탐의심',
  '전기요금 오르면 경제는|ETF': '오탐의심', '전기요금 오르면 경제는|주식': '오탐의심',
  '주식|자산': '오탐의심', '자산|채권': '오탐의심', '자산|금(Gold)': '오탐의심',
}
function classify(v) {
  const key = `${v.from}|${v.mentions}`
  if (!(key in MANUAL_CLASSIFICATION)) throw new Error(`분류 안 된 위반 항목: ${key} — 스니펫을 직접 읽고 MANUAL_CLASSIFICATION에 추가할 것.`)
  return MANUAL_CLASSIFICATION[key]
}

// ---------- 7. 출력 ----------
const lines = []
lines.push('# 초보자용 경제 단어 커리큘럼 초안 v2')
lines.push('')
lines.push(`생성 시각: ${new Date().toISOString()}`)
lines.push('')
lines.push('v1(scripts/output/curriculum-draft.md, 고정 10챕터x10개)의 문제 3가지를 고쳐서 다시 짰다.')
lines.push('개수를 먼저 정하지 않고 주제 덩어리를 먼저 잡은 뒤 챕터 순서와 이름을 붙였다. difficulty 태그는')
lines.push('참고만 하고 정렬에 쓰지 않았다(태그 자체가 내부적으로 일관성이 없기 때문 — 예: 인플레이션=easy인데')
lines.push('디플레이션=medium, ETF=easy인데 인덱스 펀드=medium).')
lines.push('')
lines.push('챕터 순서 원칙: 일상에서 가까운 것(금리·물가·집·저축·투자) -> 나라 경제(국내+국제, 고빈도 hard 포함)')
lines.push('-> 세금 -> 노후 준비 -> 추상적인 시장 원리. "나라 경제 읽기"를 8번째(전체 11개 중 중반 이후)에')
lines.push('배치해 미국 금리(39회)·달러 인덱스(33회)·경상수지(32회)가 v1처럼 맨 마지막 챕터에 묻히지 않게 했다.')
lines.push('')
lines.push('## 1. 챕터 구성')
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

lines.push('## 2. 총 개수와 챕터 수')
lines.push('')
lines.push(`총 ${totalAssigned}개, ${chapterItems.length}챕터. 기존 한잎 65개(70개 중 5개 제외) + 신규 개념 31개(갭 224개 중 큐레이션, v1의 35개에서 저빈도·저생활밀착 4개 추가 제외).`)
lines.push('100개를 채우지 않은 이유: v1처럼 정원을 고정하면 빈도 0~1짜리 항목을 억지로 채워야 했는데,')
lines.push('그 4개(탄력성·로보어드바이저·자사주 매입·원자재가격)는 실제로 콘텐츠로 만들 실익이 약해 뺐다.')
lines.push('챕터당 개수는 6~12개로 자연스럽게 갈렸다(고정 틀을 풀었기 때문).')
lines.push('')

lines.push('## 3. v1에서 제외한 항목')
lines.push('')
lines.push('### 기존 한잎 중 제외 (v1과 동일, 5개)')
lines.push('')
lines.push('| id | 제목 | 이유 |')
lines.push('|---|---|---|')
for (const id of EXCLUDED_HARD_IDS) {
  const b = economicBites.find((x) => x.id === id)
  lines.push(`| ${id} | ${b.title} | ${EXCLUSION_REASONS[id]} |`)
}
lines.push('')
lines.push('### v1 신규 개념 35개 중 이번에 추가로 제외한 4개')
lines.push('')
lines.push('| 제목 | 이유 |')
lines.push('|---|---|')
for (const t of V1_CUT_IDS) {
  lines.push(`| ${t} | ${V1_CUT_REASONS[t]} |`)
}
lines.push('')

lines.push('## 4. 신규 제작 필요 목록')
lines.push('')
lines.push(`총 ${newItems.length}개 — 기존 한잎이 없어 새로 만들어야 하는 콘텐츠.`)
lines.push('')
lines.push('| 제목 | 뉴스 빈도 | 소속 챕터 | 비고 |')
lines.push('|---|---|---|---|')
for (const ch of chapterItems) {
  for (const it of ch.items) {
    if (it.kind !== 'new') continue
    lines.push(`| ${it.title} | ${it.freq} | ${ch.name} | ${it.note || ''} |`)
  }
}
lines.push('')

lines.push('## 5. 순서 위반')
lines.push('')
lines.push('> 검사 방법: v1과 동일 — 기존 한잎의 description+whyImportant 본문에서 뒤 챕터 항목의 제목이')
lines.push('> 문자열로 등장하는지 확인(2글자 이하는 경계 검사). 신규 개념은 본문이 없어 검사 대상에서 제외.')
lines.push('')
lines.push(`규칙 C(시나리오는 전제 개념 챕터의 맨 뒤) 적용 결과, 시나리오 관련 위반: **${scenarioViolations.length}건** (v1에서는 6건).`)
lines.push('')
lines.push('v1의 6건 중 3건은 이번 재배치로 완전히 사라졌다(기름값이 오르면→인플레이션, 금리가 오르면 내 대출은→')
lines.push('가산금리, 환율이 오르면 장바구니는→환율 — 모두 "주 전제 개념과 같은 챕터"가 되어 자동으로 위반 조건에서')
lines.push('빠짐). 남은 4건은 성격이 다르다: 각 시나리오의 **주 전제 개념은 이미 올바른 챕터 맨 뒤에 배치돼 있고**,')
lines.push('본문에서 지나가듯 언급하는 **부차적인 단어**가 뒤 챕터에 있어서 걸린 것이다(예: "기름값이 오르면"의')
lines.push('주 전제는 인플레이션이고 이미 해결됐는데, 본문에 곁들여 나오는 "무역수지"가 8챕터에 있어 걸림).')
lines.push('아래 오탐/실제검토 분류에도 포함되어 있다.')
lines.push('')
if (scenarioViolations.length > 0) {
  lines.push('| 시나리오 | 챕터 | 언급 | 챕터 | 분류 |')
  lines.push('|---|---|---|---|---|')
  for (const v of scenarioViolations) lines.push(`| ${v.from} | ${v.fromChapter} | ${v.mentions} | ${v.mentionsChapter} | ${classify(v)} |`)
}
lines.push('')
lines.push(`총 ${violations.length}건. 아래 두 그룹으로 나눴다 — 자동으로 순서를 바꾸지 않았다.`)
lines.push('')
lines.push('> 참고(자동 수정 안 함, 검토용): "실제 검토 필요" 4건 중 "긴축정책(1챕터) → 인플레이션(2챕터)"과')
lines.push('> "디플레이션(2챕터) → 경기침체(8챕터)"는 챕터 순서 자체를 다시 생각해볼 여지가 있다. 긴축정책의')
lines.push('> 존재 이유가 "인플레이션을 잡기 위해서"인데 인플레이션 챕터가 그 뒤에 온다 — 물가(2챕터)를 금리')
lines.push('> (1챕터)보다 앞에 두는 순서도 고려해볼 만하다(중앙은행은 물가를 보고 금리를 정하므로).')
lines.push('')
const real = violations.filter((v) => classify(v) === '실제검토필요')
const suspect = violations.filter((v) => classify(v) === '오탐의심')
lines.push(`### 실제 검토 필요 (${real.length}건)`)
lines.push('')
lines.push('본문에서 해당 단어가 정의·설명의 핵심으로 쓰인 경우.')
lines.push('')
lines.push('| 앞 항목(챕터) | 뒤 항목(챕터) | 본문 스니펫 |')
lines.push('|---|---|---|')
for (const v of real) lines.push(`| ${v.from} (${v.fromChapter}) | ${v.mentions} (${v.mentionsChapter}) | "...${v.snippet}..." |`)
lines.push('')
lines.push(`### 오탐 의심 (${suspect.length}건)`)
lines.push('')
lines.push('흔한 일반명사가 예시·나열로 스쳐 지나가듯 등장한 경우.')
lines.push('')
lines.push('| 앞 항목(챕터) | 뒤 항목(챕터) | 본문 스니펫 |')
lines.push('|---|---|---|')
for (const v of suspect) lines.push(`| ${v.from} (${v.fromChapter}) | ${v.mentions} (${v.mentionsChapter}) | "...${v.snippet}..." |`)
lines.push('')

lines.push('## 6. 챕터 이름 검증')
lines.push('')
lines.push('각 챕터 이름이 안의 모든 항목을 설명하는지 스스로 점검한 결과.')
lines.push('')
lines.push('| 챕터 | 판정 | 메모 |')
lines.push('|---|---|---|')
const NAME_CHECK = {
  '1. 금리와 통화정책 — 돈을 빌리는 값이 정해지는 방식': ['일치', '양적완화·긴축정책은 "금리" 자체는 아니지만 중앙은행이 금리/통화량으로 움직이는 정책 수단이라 "통화정책"을 이름에 포함해 커버.'],
  '2. 물가 — 돈의 가치가 오르내리는 이유': ['일치', ''],
  '3. 집 — 사고, 빌리고, 세금 내기': ['일치', '부동산 매매·대출·보유세·양도세를 모두 아우르려고 이름을 3단으로 구성.'],
  '4. 저축과 보험 — 내 통장 관리': ['일치', ''],
  '5. 투자 첫걸음': ['일치', ''],
  '6. 자산의 기본': ['일치', ''],
  '7. 포트폴리오와 투자 위험': ['일치', '레버리지·공매도(위험)와 자산배분·리밸런싱(포트폴리오)을 함께 묶음.'],
  '8. 나라 경제 읽기': ['일치', '국내(GDP·실업률·경기침체)와 국제(환율·달러 인덱스·경상수지·관세)를 모두 포괄하는 넓은 이름으로 설계.'],
  '9. 세금 — 내가 내는 돈': ['일치', ''],
  '10. 새로운 투자와 노후 준비': ['애매', '비트코인/ESG/서학개미(새로운 투자 트렌드)와 연금/퇴직연금/IRP(노후 준비)가 사실은 서로 다른 두 묶음. 이름을 복합으로 붙여 정직하게 표시했지만, 더 쪼갤 수도 있음.'],
  '11. 시장을 움직이는 원리': ['일치', ''],
}
for (const ch of chapterItems) {
  const [verdict, memo] = NAME_CHECK[ch.name] ?? ['미확인', '']
  lines.push(`| ${ch.name} | ${verdict} | ${memo} |`)
}
lines.push('')

const outPath = path.join(__dirname, 'output', 'curriculum-draft-v2.md')
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`작성 완료: ${outPath}`)
console.log(`총 개수: ${totalAssigned}, 챕터 수: ${chapterItems.length}`)
console.log(`신규 제작 필요: ${newItems.length}개`)
console.log(`순서 위반: ${violations.length}건 (실제검토 ${real.length} / 오탐의심 ${suspect.length})`)
console.log(`시나리오 위반: ${scenarioViolations.length}건 (v1: 6건)`)
