/**
 * 초보자용 경제 단어 커리큘럼 — 11챕터 96개 확정본 메타데이터.
 * 기준 문서: docs/curriculum/README.md
 *
 * 각 챕터의 items는 순서대로 정렬돼 있다. 이미 만든 카드는 { id }, 아직 안 만든
 * 카드는 { title, pending: true } 형태다 — pending 카드를 실제로 만들면 id로
 * 교체한다(제목은 docs/curriculum/README.md "신규 제작 목록"과 동일하게 유지).
 */

export const CURRICULUM_CHAPTERS = [
  {
    number: 1,
    name: '자산의 기본',
    subtitle: null,
    items: [
      { id: 43 },
      { id: 44 },
      { id: 3 },
      { id: 21 },
      { id: 27 },
      { id: 82 },
      { id: 83 },
    ],
  },
  {
    number: 2,
    name: '저축과 보험',
    subtitle: '내 통장 관리',
    items: [
      { id: 10 },
      { id: 11 },
      { id: 12 },
      { id: 53 },
      { id: 56 },
      { id: 84 },
      { id: 85 },
      { id: 86 },
      { id: 87 },
      { id: 88 },
    ],
  },
  {
    number: 3,
    name: '물가',
    subtitle: '돈의 가치가 오르내리는 이유',
    items: [
      { id: 4 },
      { id: 5 },
      { id: 14 },
      { id: 19 },
      { id: 76 },
      { id: 71 },
      { id: 80 },
      { id: 75 },
      { id: 89 },
    ],
  },
  {
    number: 4,
    name: '금리와 통화정책',
    subtitle: '돈을 빌리는 값이 정해지는 방식',
    items: [
      { id: 1 },
      { id: 37 },
      { id: 38 },
      { id: 28 },
      { id: 50 },
      { id: 72 },
      { id: 74 },
      { id: 90 },
      { id: 91 },
      { id: 92 },
      { id: 93 },
    ],
  },
  {
    number: 5,
    name: '집',
    subtitle: '사고, 빌리고, 세금 내기',
    items: [
      { id: 17 },
      { id: 58 },
      { title: '부동산', pending: true },
      { title: '대출 규제', pending: true },
      { title: '가계부채', pending: true },
      { title: '주택담보대출(LTV)', pending: true },
      { title: '보유세(재산세·종합부동산세)', pending: true },
      { title: '양도소득세', pending: true },
      { title: '재개발·재건축', pending: true },
    ],
  },
  {
    number: 6,
    name: '투자 첫걸음',
    subtitle: null,
    items: [
      { id: 9 },
      { id: 2 },
      { id: 22 },
      { id: 36 },
      { id: 35 },
      { id: 48 },
      { id: 20 },
      { id: 7 },
      { id: 40 },
      { id: 94 },
      { id: 95 },
      { id: 96 },
      { id: 97 },
    ],
  },
  {
    number: 7,
    name: '포트폴리오와 투자 위험',
    subtitle: null,
    items: [
      { id: 15 },
      { id: 18 },
      { id: 59 },
      { id: 57 },
      { id: 8 },
      { id: 49 },
      { id: 29 },
      { id: 34 },
      { id: 60 },
    ],
  },
  {
    number: 8,
    name: '나라 경제 읽기',
    subtitle: null,
    items: [
      { id: 6 },
      { id: 33 },
      { id: 23 },
      { id: 32 },
      { id: 13 },
      { id: 41 },
      { id: 45 },
      { id: 73 },
      { id: 78 },
      { id: 79 },
      { title: '관세', pending: true },
      { title: '공급망', pending: true },
    ],
  },
  {
    number: 9,
    name: '세금',
    subtitle: '내가 내는 돈',
    items: [
      { id: 46 },
      { id: 51 },
      { id: 47 },
      { title: '세금', pending: true },
      { title: '상속세·증여세', pending: true },
      { title: '거래세', pending: true },
    ],
  },
  {
    number: 10,
    name: '노후 준비',
    subtitle: null,
    items: [
      { id: 16 },
      { id: 31 },
      { id: 77 },
      { title: '개인형퇴직연금(IRP)', pending: true },
      { title: '자산관리', pending: true },
    ],
  },
  {
    number: 11,
    name: '시장을 움직이는 원리',
    subtitle: null,
    items: [
      { id: 26 },
      { id: 42 },
      { id: 24 },
      { id: 25 },
      { title: '독점', pending: true },
    ],
  },
]

/** 챕터 하나의 { total, completed } 개수. */
export function getChapterProgress(chapterNumber) {
  const chapter = CURRICULUM_CHAPTERS.find((c) => c.number === chapterNumber)
  if (!chapter) return { total: 0, completed: 0 }
  const total = chapter.items.length
  const completed = chapter.items.filter((it) => !it.pending).length
  return { total, completed }
}

/** 전체 11챕터의 진행 현황 배열. */
export function getAllChaptersProgress() {
  return CURRICULUM_CHAPTERS.map((c) => ({
    number: c.number,
    name: c.name,
    subtitle: c.subtitle,
    ...getChapterProgress(c.number),
  }))
}

/** 96개 전체를 챕터/순서 그대로 펼친 배열. 완성 카드는 id가 있고, pending 카드는 id가 null이다. */
export function getCurriculumSequence() {
  const sequence = []
  for (const chapter of CURRICULUM_CHAPTERS) {
    chapter.items.forEach((item, index) => {
      sequence.push({
        chapter: chapter.number,
        chapterName: chapter.name,
        order: index + 1,
        id: item.pending ? null : item.id,
        title: item.title ?? null,
        pending: Boolean(item.pending),
      })
    })
  }
  return sequence
}

/** 커리큘럼 순서대로 정렬된, 실제로 존재하는(=pending이 아닌) 한잎 id 목록. */
export function getCurriculumOrderedBiteIds() {
  return getCurriculumSequence()
    .filter((item) => !item.pending && item.id != null)
    .map((item) => item.id)
}
