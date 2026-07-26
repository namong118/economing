#!/usr/bin/env node
/**
 * 초보자용 경제 단어 커리큘럼 초안 v3.
 * v2는 챕터 내용/이름/시나리오 배치는 옳았지만 챕터 "순서"가 거꾸로였다:
 * 오탐 의심 34건 중 21건(55%)이 1챕터(금리와 통화정책) 하나에서 나왔는데, 방향이 전부
 * "금리 -> 주식/예금/부동산/자산/투자"였다. 한 방향으로 몰린 건 오탐이 아니라, 통화정책
 * 설명이 애초에 "이미 아는 기본 어휘가 어떻게 움직이는지"를 설명하는 챕터라서 그 전제
 * 어휘(자산의 기본, 저축, 투자 첫걸음 등)가 먼저 와야 한다는 구조적 신호였다.
 * 이번엔 챕터 내부 구성은 유지하고 "순서"만 재배치한다. AI 재호출 없음.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import economicBites from '../src/data/economicBites.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------- 1. 기존 70개 중 제외 (v1/v2와 동일) ----------
const EXCLUDED_HARD_IDS = [30, 39, 52, 54, 55]
const EXCLUSION_REASONS = {
  30: 'PER — 투자 분석 지표. 뉴스 빈도 1회, 손익/재무제표 이해가 선행돼야 함.',
  39: '재무제표 — 회계 기초가 선행돼야 하는 심화 개념. 빈도 1회.',
  52: '할인율 — 채권/현재가치 계산 개념으로 진입장벽이 높음. 빈도 2회.',
  54: '주가수익비율(PBR) — PER와 같이 봐야 의미 있는 심화 지표. 빈도 1회.',
  55: '경제적 해자 — 기업 분석 개념. 뉴스 빈도 사실상 없음(1회).',
}

// ---------- 2. v1의 신규 개념 35개 중 4개 제외 (v2와 동일, 변경 없음) ----------
const V1_CUT_IDS = ['탄력성', '로보어드바이저', '자사주 매입', '원자재가격']
const V1_CUT_REASONS = {
  '탄력성': '빈도 0, 생활밀착도 낮음(추상적 가격이론). 수요와 공급 하나로 "시장 원리" 챕터가 이미 성립해 중복 없이 뺄 수 있음.',
  '로보어드바이저': '빈도 1, 생활밀착도 낮음. 실제 개념이라기보다 상품명에 가까움 — "돈이 되는" 실익 근거가 약함.',
  '자사주 매입': '빈도 1, 생활밀착도 낮음. PER/PBR과 같은 계열의 투자분석 소재라 제외한 심화 항목들과 같은 이유로 제외.',
  '원자재가격': '빈도 1, 생활밀착도 낮음. 금(Gold)·기름값(기존 71번) 이 이미 원자재 가격 이야기를 다루고 있어 별도 카드가 없어도 됨.',
}

// 31개, chapter 필드만 v3 챕터 순서에 맞게 갱신 (invest/newinvest -> invest/retire로 재배정)
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
  { title: '가계부채', freq: 44, chapter: 'house', note: '가계부채 관리/가계대출/가계신용 통합. 부채(1챕터, 추상)의 응용판이지만 실제 뉴스에선 거의 항상 부동산 대출/DSR 규제와 함께 논의되는 정책 지표라 집 챕터에 둠(아래 3번 참고).' },
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
  { title: '비트코인·암호화폐', freq: 5, chapter: 'invest', note: '암호화폐 투자 2 + 비트코인 1 + 비트코인 ETF 1 + 채굴 1 통합. v2에서 "새로운 투자와 노후 준비"에 있던 걸 투자 챕터로 흡수(4번 참고).' },
  { title: 'ESG 투자', freq: 2, chapter: 'invest', note: 'ESG 1 + ESG 경영 1 통합. 투자 챕터로 흡수.' },
  { title: '서학개미', freq: 1, chapter: 'invest', note: '해외주식 투자 — 구조적 트렌드로 판단, 유행어 아님. 투자 챕터로 흡수.' },
  { title: '개인형퇴직연금(IRP)', freq: 1, chapter: 'retire', note: '기존 퇴직연금(31)/연금(16)의 실천형 상품. 노후 준비 챕터로 분리.' },
  { title: '자산관리', freq: 1, chapter: 'retire', note: '노후 준비 실전형 마무리 개념. 노후 준비 챕터로 분리.' },
  { title: '독점', freq: 0, chapter: 'micro', note: 'relatedTerms 발견분. 규모의 경제(42)의 확장, 통신사·배달앱 등 체감 사례 풍부.' },
]

if (NEW_CONCEPTS.length !== 31) throw new Error(`NEW_CONCEPTS 개수 오류: ${NEW_CONCEPTS.length} (기대: 31)`)

// ---------- 3. 기존 70개 빈도 재계산 (동일 로직) ----------
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

// ---------- 4. 챕터 구성 v3 — 순서만 재배치, 내부 구성은 v2 유지(10번만 분해) ----------
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
if (unassigned.length > 0) throw new Error(`배정 안 된 항목 ${unassigned.length}개: ${unassigned.map((it) => it.title).join(', ')}`)
const totalAssigned = chapterItems.reduce((sum, ch) => sum + ch.items.length, 0)
if (totalAssigned !== 96) throw new Error(`배정 총합 오류: ${totalAssigned} (기대: 96)`)
for (const ch of chapterItems) {
  if (ch.items.length > 14) throw new Error(`[${ch.name}] ${ch.items.length}개 — 14개 초과`)
}

// ---------- 6. 순서 위반 검사 (코드 전용, v2와 동일 로직) ----------
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
      if (m) hits.push({ form, index: text.indexOf(form, m.index) })
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

const scenarioTitles = new Set(['기름값이 오르면', '환율이 오르면 장바구니는', '아파트값과 금리의 관계', '최저임금 오르면 물가도 오를까', '전기요금 오르면 경제는', '주식시장 폭락하면 내 연금은', '중국 경제 흔들리면 한국은', '미국 금리가 오르면 한국은', '내 월급의 실질 가치는', '금리가 오르면 내 대출은'])
const scenarioViolations = violations.filter((v) => scenarioTitles.has(v.from))

// 출처(from)별로 묶어서 개수 세기 — 3건 이상 몰린 출처는 구조적 신호이니 별도 표시
const bySource = new Map()
for (const v of violations) {
  if (!bySource.has(v.from)) bySource.set(v.from, [])
  bySource.get(v.from).push(v)
}
const clusteredSources = [...bySource.entries()].filter(([, vs]) => vs.length >= 3).sort((a, b) => b[1].length - a[1].length)

// 오탐 의심 / 실제 검토 필요 분류 — 38건 전부 스니펫을 직접 읽고 판단(v2에서 없던 신규 위반도 포함).
// 기준: 인과관계·정의의 핵심으로 쓰였으면 실제검토필요, 예시·나열·이미 다들 아는 일반명사로
// 스쳐 지나가면 오탐의심. 3건 이상 몰린 출처(금리 인하·자산·기준금리·유동성·금리 인상)도 이번엔
// "구조 문제 아닌가"를 먼저 의심하고 각 건을 다시 읽었다 — 아래에 그 결과를 반영했다.
const MANUAL_CLASSIFICATION = {
  '디플레이션|경기침체': '실제검토필요', // "디플레이션은 경기침체의 신호예요" — 직접적 인과 정의
  '금리 인하|채권': '실제검토필요', // "금리 인하 시기에는 채권 가격이 오르고" — 금리·채권가 역상관은 핵심 개념 관계
  '기름값이 오르면|무역수지': '실제검토필요', // "무역수지 적자가 커지고" — 구체적 인과 주장

  // 기준금리(3건) — 전부 "대출 이자, 예금 이자, 주식 시장, 부동산 가격까지" 식 영향 범위 나열이거나
  // "소비와 투자가 줄어든다"는 일반적 서술. 3건이 몰려 있지만 방향이 서로 다른 챕터(5,6)로 흩어져
  // 있고 전부 예시 나열이라 오탐의심으로 유지.
  '기준금리|주식': '오탐의심', '기준금리|부동산': '오탐의심', '기준금리|투자': '오탐의심',
  '복리|투자': '오탐의심', // "20대에 투자를 시작하면" — 일반명사
  '인플레이션|투자': '오탐의심',
  '디플레이션|투자': '오탐의심',
  '예금|금리': '오탐의심', // "정기예금은 기간이 길수록 금리가 높아요" — 일상어로서의 금리
  '예금|투자': '오탐의심',
  '비상금|주식': '오탐의심', '비상금|투자': '오탐의심',
  '소비자물가지수(CPI)|금리': '오탐의심', // "중앙은행은 CPI를 보고 금리를 결정" — 뒤에 나올 내용을 미리 언급(예고), 이해에 필수 아님
  '스태그플레이션|금리': '오탐의심', // "금리를 올리면 경기가 더 나빠지는" — 일상어
  // 유동성(3건) — 전부 "유동성이 높다/낮다"를 설명하기 위한 예시(주식=유동적, 부동산=비유동적,
  // 비상금=유동적이어야 함). 유동성 개념 자체를 정의하는 문장 안의 예시라 오탐의심.
  '유동성|주식': '오탐의심', '유동성|비상금': '오탐의심', '유동성|부동산': '오탐의심',
  '양적완화|주식': '오탐의심', '양적완화|부동산': '오탐의심',
  // 금리 인상(3건) — "주식과 부동산 가격을 끌어내리는 경향", "예금 수익률이 높아져" 모두 효과 서술.
  '금리 인상|주식': '오탐의심', '금리 인상|수익률': '오탐의심', '금리 인상|부동산': '오탐의심',
  // 금리 인하(4건, 채권 제외 3건) — 나머지는 효과 서술.
  '금리 인하|주식': '오탐의심', '금리 인하|부동산': '오탐의심', '금리 인하|투자': '오탐의심',
  // 자산(4건) — "금융자산(현금, 주식, 채권)과 실물자산(부동산, 금, 자동차)" 한 문장의 나열.
  '자산|채권': '오탐의심', '자산|주식': '오탐의심', '자산|금(Gold)': '오탐의심', '자산|부동산': '오탐의심',
  '부채|부동산': '오탐의심', // "부동산 투자처럼 자산을 늘리는 좋은 부채" — 예시
  '소득세|개인형퇴직연금(IRP)': '오탐의심', // "IRP, 연금저축, 의료비 공제 등을" — 나열
  '긴축정책|주식': '오탐의심', '긴축정책|부동산': '오탐의심',
  '신용등급|금리': '오탐의심', // "낮은 금리로 돈을 빌릴 수 있어요" — 일상어
  '아파트값과 금리의 관계|부동산': '오탐의심',
  '전기요금 오르면 경제는|ETF': '오탐의심', '전기요금 오르면 경제는|주식': '오탐의심',
}
function classify(v) {
  const key = `${v.from}|${v.mentions}`
  if (!(key in MANUAL_CLASSIFICATION)) throw new Error(`분류 안 된 위반 항목: ${key} (스니펫: "${v.snippet}") — MANUAL_CLASSIFICATION에 추가할 것.`)
  return MANUAL_CLASSIFICATION[key]
}

// ---------- 7. 출력 ----------
const lines = []
lines.push('# 초보자용 경제 단어 커리큘럼 초안 v3')
lines.push('')
lines.push(`생성 시각: ${new Date().toISOString()}`)
lines.push('')
lines.push('v2(scripts/output/curriculum-draft-v2.md)에서 챕터 내용·이름·시나리오 배치는 그대로 두고')
lines.push('**챕터 순서만** 재배치했다. v2의 오탐 의심 34건 중 21건(62%)이 "1. 금리와 통화정책" 하나에서')
lines.push('나왔고 방향이 전부 "금리류 -> 주식/예금/부동산/자산/투자"로 한쪽이었다 — 오탐이 아니라 통화정책')
lines.push('설명이 애초에 그 기본 어휘를 이미 안다고 전제하고 쓰여 있다는 신호였다. 자산의 기본(6건 전부')
lines.push('이 챕터를 가리킴)도 같은 이유로 앞으로 옮겼다.')
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
lines.push(`총 ${totalAssigned}개, ${chapterItems.length}챕터 — v2와 총 개수·챕터 수 동일(내용은 그대로 두고 순서만 재배치).`)
lines.push('')

lines.push('## 3. v1/v2에서 제외한 항목 (변경 없음)')
lines.push('')
lines.push('### 기존 한잎 중 제외 (5개)')
lines.push('')
lines.push('| id | 제목 | 이유 |')
lines.push('|---|---|---|')
for (const id of EXCLUDED_HARD_IDS) {
  const b = economicBites.find((x) => x.id === id)
  lines.push(`| ${id} | ${b.title} | ${EXCLUSION_REASONS[id]} |`)
}
lines.push('')
lines.push('### v1 신규 개념 중 제외 (4개)')
lines.push('')
lines.push('| 제목 | 이유 |')
lines.push('|---|---|')
for (const t of V1_CUT_IDS) lines.push(`| ${t} | ${V1_CUT_REASONS[t]} |`)
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
lines.push('> 검사 방법: v1/v2와 동일 — 기존 한잎의 description+whyImportant 본문에서 뒤 챕터 항목의 제목이')
lines.push('> 문자열로 등장하는지 확인(2글자 이하는 경계 검사). 신규 개념은 본문이 없어 검사 대상에서 제외.')
lines.push('')
lines.push(`### v2 대비 총계 비교`)
lines.push('')
lines.push(`v2: 38건 -> v3: **${violations.length}건**`)
lines.push('')
if (violations.length < 38) {
  lines.push(`${38 - violations.length}건 감소. 재배치가 효과가 있었다는 뜻.`)
} else if (violations.length === 38) {
  lines.push('**총계는 줄지 않았다.** 다만 내용은 달라졌다 — v2의 21건은 "1. 금리와 통화정책" 한 챕터에서')
  lines.push('한 방향으로 몰려 있었지만(구조적 신호), v3에서 그 21건은 3건의 새로운 기존 한잎(디플레이션,')
  lines.push('금리 인하, 기름값이 오르면 — 뒤에서 실제검토필요로 분류됨)을 빼면 대부분 사라졌다. 대신 예금·')
  lines.push('신용등급·CPI·스태그플레이션·유동성·복리·부채처럼 "1. 자산의 기본"~"3. 물가"에 있는 항목들이')
  lines.push('"금리"라는 일상 단어를 스치듯 언급하면서 **새로운** 위반이 그만큼 생겨 총계가 상쇄됐다.')
  lines.push('이 신규 위반들은 아래에서 전부 오탐의심으로 분류했다(뒤 챕터의 공식 개념 카드를 요구하는 게')
  lines.push('아니라 "금리"라는 흔한 단어를 일상적 의미로 스쳐 쓴 것) — 하지만 이건 순전히 판단이라, 총계가')
  lines.push('안 줄었다는 사실 자체는 숨기지 않고 그대로 보고한다. "금리/기준금리"라는 단어 자체가 워낙 흔해서')
  lines.push('어느 챕터를 앞에 두든 그 앞에 있는 챕터들은 "금리"를 스치듯 언급할 수밖에 없어 보인다 — 근본적으로')
  lines.push('해결하려면 "금리"라는 말 자체(가장 기초적인 의미)를 훨씬 앞 챕터로 분리하는 방법도 있는데, 이번')
  lines.push('요청은 챕터 순서만 바꾸는 것이라 시도하지 않았다.')
} else {
  lines.push('**감소하지 않았다 — 재배치가 기대한 효과를 내지 못한 것으로 보임. 검토 필요.**')
}
lines.push('')

lines.push('### "1. 금리와 통화정책" 출처 위반 확인')
lines.push('')
const rateChapterIdx = chapterItems.findIndex((ch) => ch.name.includes('금리와 통화정책'))
const rateSourceViolationsNow = violations.filter((v) => v.fromChapter === rateChapterIdx + 1)
lines.push(`v2에서 "1. 금리와 통화정책" 출처 위반: 21건 -> v3에서 "${chapterItems[rateChapterIdx].name}"(이제 ${rateChapterIdx + 1}번) 출처 위반: **${rateSourceViolationsNow.length}건**.`)
if (rateSourceViolationsNow.length === 0) {
  lines.push('완전히 해소됨 — 통화정책이 이제 자산/저축/투자 챕터 뒤에 오므로, 본문이 참조하는 기본 어휘를 이미 배운 뒤가 됨.')
} else {
  lines.push('')
  lines.push('| 뒤 항목(챕터) | 스니펫 |')
  lines.push('|---|---|')
  for (const v of rateSourceViolationsNow) lines.push(`| ${v.mentions} (${v.mentionsChapter}) | "...${v.snippet}..." |`)
}
lines.push('')

lines.push('### 출처별 위반 집계 (3건 이상 몰린 출처는 구조적 신호)')
lines.push('')
lines.push('| 출처(앞 항목) | 챕터 | 위반 건수 | 비고 |')
lines.push('|---|---|---|---|')
for (const [source, vs] of [...bySource.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const flag = vs.length >= 3 ? '⚠️ 구조적 신호 의심' : ''
  lines.push(`| ${source} | ${vs[0].fromChapter} | ${vs.length} | ${flag} |`)
}
lines.push('')
if (clusteredSources.length > 0) {
  lines.push(`3건 이상 몰린 출처 ${clusteredSources.length}개: ${clusteredSources.map(([s, vs]) => `${s}(${vs.length}건)`).join(', ')}.`)
  lines.push('아래 오탐/실제검토 분류 시 이 출처들은 "우연히 겹친 일반명사"로 넘기지 않고 각 건을 개별로 다시 읽었다.')
} else {
  lines.push('3건 이상 몰린 출처 없음 — v2 같은 구조적 편중은 사라졌다.')
}
lines.push('')

lines.push(`총 ${violations.length}건. 아래 두 그룹으로 나눴다 — 자동으로 순서를 바꾸지 않았다.`)
lines.push('')
const real = violations.filter((v) => classify(v) === '실제검토필요')
const suspect = violations.filter((v) => classify(v) === '오탐의심')
lines.push(`### 실제 검토 필요 (${real.length}건)`)
lines.push('')
lines.push('| 앞 항목(챕터) | 뒤 항목(챕터) | 본문 스니펫 |')
lines.push('|---|---|---|')
for (const v of real) lines.push(`| ${v.from} (${v.fromChapter}) | ${v.mentions} (${v.mentionsChapter}) | "...${v.snippet}..." |`)
lines.push('')
lines.push(`### 오탐 의심 (${suspect.length}건)`)
lines.push('')
lines.push('| 앞 항목(챕터) | 뒤 항목(챕터) | 본문 스니펫 |')
lines.push('|---|---|---|')
for (const v of suspect) lines.push(`| ${v.from} (${v.fromChapter}) | ${v.mentions} (${v.mentionsChapter}) | "...${v.snippet}..." |`)
lines.push('')

lines.push('## 6. 챕터 이름 검증')
lines.push('')
lines.push('| 챕터 | 판정 | 메모 |')
lines.push('|---|---|---|')
const NAME_CHECK = {
  '1. 자산의 기본': ['일치', ''],
  '2. 저축과 보험 — 내 통장 관리': ['일치', ''],
  '3. 물가 — 돈의 가치가 오르내리는 이유': ['일치', ''],
  '4. 금리와 통화정책 — 돈을 빌리는 값이 정해지는 방식': ['일치', '양적완화·긴축정책은 중앙은행이 금리/통화량으로 움직이는 정책 수단이라 "통화정책"에 포함.'],
  '5. 집 — 사고, 빌리고, 세금 내기': ['일치', ''],
  '6. 투자 첫걸음': ['일치', '비트코인·ESG·서학개미를 v2의 "새로운 투자와 노후 준비"에서 흡수 — 모두 "투자 상품/방식"이라 이름과 어긋나지 않음.'],
  '7. 포트폴리오와 투자 위험': ['일치', ''],
  '8. 나라 경제 읽기': ['일치', ''],
  '9. 세금 — 내가 내는 돈': ['일치', ''],
  '10. 노후 준비': ['일치', 'v2의 "새로운 투자와 노후 준비"에서 연금·퇴직연금·IRP·자산관리·시나리오만 남겨 분리 — 이제 이름이 4개 항목을 정확히 설명함.'],
  '11. 시장을 움직이는 원리': ['일치', ''],
}
for (const ch of chapterItems) {
  const [verdict, memo] = NAME_CHECK[ch.name] ?? ['미확인', '']
  lines.push(`| ${ch.name} | ${verdict} | ${memo} |`)
}
lines.push('')

lines.push('## 7. v2 대비 변경 요약')
lines.push('')
lines.push('| 항목 | v2 | v3 |')
lines.push('|---|---|---|')
lines.push('| 챕터 순서 | 금리→물가→집→저축→투자→자산→포트폴리오→나라경제→세금→새투자/노후→시장원리 | 자산→저축→물가→금리→집→투자→포트폴리오→나라경제→세금→노후→시장원리 |')
lines.push('| "자산의 기본" 위치 | 6번 | 1번 (제일 앞) |')
lines.push('| "금리와 통화정책" 위치 | 1번 | 4번 |')
lines.push('| "물가"와 "금리" 순서 | 금리(1) 먼저, 물가(2) 나중 | 물가(3) 먼저, 금리(4) 나중 — 중앙은행이 물가를 보고 금리를 정하는 인과 순서에 맞춤 |')
lines.push('| 10번 챕터 | "새로운 투자와 노후 준비" (8개, 두 묶음 섞임 — "애매"로 표시됨) | "투자 첫걸음"이 비트코인·ESG·서학개미 흡수(6번, 13개) + "노후 준비" 단독 분리(10번, 5개) — 둘 다 "일치"로 판정 |')
lines.push('| 가계부채 위치 | 집(5번, 순서상 부채보다 앞) | 집(5번, 이제 자산의 기본이 1번이라 부채보다 뒤) — 자세한 이유는 4번 신규 목록의 가계부채 비고 참고 |')
lines.push(`| 순서 위반 총계 | 38건 | ${violations.length}건 |`)
lines.push(`| 시나리오 위반 | 4건 | ${scenarioViolations.length}건 |`)
lines.push(`| "1. 금리와 통화정책" 출처 위반 | 21건 | ${rateSourceViolationsNow.length}건 |`)
lines.push('')

const outPath = path.join(__dirname, 'output', 'curriculum-draft-v3.md')
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`작성 완료: ${outPath}`)
console.log(`총 개수: ${totalAssigned}, 챕터 수: ${chapterItems.length}`)
console.log(`순서 위반: ${violations.length}건 (v2: 38건) — 실제검토 ${real.length} / 오탐의심 ${suspect.length}`)
console.log(`"금리와 통화정책" 출처 위반: ${rateSourceViolationsNow.length}건 (v2: 21건)`)
console.log(`3건 이상 몰린 출처: ${clusteredSources.length}개`)
