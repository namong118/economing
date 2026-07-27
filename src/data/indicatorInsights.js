/* 지표 "정독형" 데이터 — indicatorsData.js의 미리 써둔 설명(description/whyImportant/
 * realExample/realLifeExample)과 달리, 오늘의 실시간 값과 연결해서 "이 숫자를 어떻게
 * 읽는지"를 담는다. 우선 기준금리(id 64) 하나만 이 스키마로 만들고, 나머지 10종은
 * indicatorsData.js의 기존 구조를 그대로 쓴다 — IndicatorPage.jsx가 id로 분기한다.
 *
 * bands: 숫자를 뜻으로 바꾸는 3요소 중 "오늘 값이 어디에 속하는지".
 *   기준금리는 절대 기준선이 없어서 2015~2026년 실제 변경 이력 분포(한국은행 공식 발표,
 *   ECOS API 아님 — 키가 서버 쪽에만 있어 공식 사이트 이력을 직접 수집)로 정했다.
 *   원래 분위수 그대로면 5구간이 나오지만, 이 지표는 0.25%p 단위로만 움직이고
 *   특정 값에 몇 년씩 머무는 경직적인 데이터라 1.50~1.75%대는 실제 비중이 8.6%뿐이라
 *   사실상 빈 구간 — 사용자 확인 후 4구간으로 줄였다.
 *   label은 "높음/낮음" 같은 절대 판단이 아니라 "최근 10년 분포상 위치"로만 표현한다
 *   (이 창은 코로나 긴급 인하를 포함한 이례적 저금리 시기가 대부분이라, 여기 기준으로
 *   "보통"을 정하면 평상시가 아니라 비상시를 기준으로 삼게 된다).
 */
const indicatorInsights = {
  64: {
    oneLiner: '한국은행이 정하는, 모든 금리의 출발점',
    range: { min: 0, max: 4 },

    bands: [
      { max: 1.00, label: '최근 10년 중 가장 낮은 수준', meaning: '경기를 살리려고 돈을 푸는 상태예요' },
      { max: 1.50, label: '낮은 편',                     meaning: '대출받기 부담이 적고, 소비·투자가 활발해지기 쉬운 상태예요' },
      { max: 2.75, label: '중간~높은 편',                 meaning: '물가를 잡기 위해 어느 정도 긴축을 하고 있는 상태예요' },
      { max: 99,   label: '최근 10년 중 높은 편',          meaning: '물가를 강하게 잡으려고 돈줄을 죄는 상태예요' },
    ],
    bandSource: '2015~2026년 기준금리 변경 이력 분포 (한국은행) · 이 기간은 저금리 시기가 길어, 절대적 높낮이가 아닌 최근 10년 내 위치를 나타냅니다',

    direction: {
      up: {
        headline: '올라가면',
        effects: [
          '변동금리 대출 이자 부담이 커져요',
          '예금·적금 금리도 함께 올라 저축이 유리해져요',
          '주식·부동산 같은 자산 시장은 위축되기 쉬워요',
        ],
      },
      down: {
        headline: '내려가면',
        effects: [
          '대출 이자 부담이 줄어들어요',
          '예금 금리도 낮아져 저축 매력이 떨어져요',
          '기업 투자와 소비가 살아나기 쉬워요',
        ],
      },
    },

    // anchors에는 과거 기준점만 넣는다 — 현재값은 실시간 데이터(오늘 마커)가 담당하므로
    // '현재' 같은 항목을 넣으면 "오늘" 표시가 두 개가 되어 혼란을 준다.
    anchors: [
      { value: 0.50, when: '2020년 5월 코로나', note: '역대 최저' },
      { value: 3.50, when: '2023년 1월',        note: '물가 대응 인상, 최근 최고' },
    ],

    myLife: [
      { when: '변동금리 주택담보대출이 있다면', then: '3억원 대출 기준, 금리가 0.25%p 오르면 월 이자가 약 6만 2천원 늘어나요' },
      { when: '예금·적금을 새로 들 계획이라면', then: '금리가 높을 때일수록 예금 상품 금리도 함께 올라 유리해요' },
    ],

    newsPhrases: [
      { phrase: '기준금리 동결', meaning: '금리를 그대로 둔다는 뜻. 지금 수준을 유지하겠다는 신호예요' },
      { phrase: '베이비스텝',   meaning: '0.25%p씩 조정하는 것. 가장 일반적인 폭이에요' },
      { phrase: '빅스텝',      meaning: '0.5%p 조정. 평소의 두 배라 상황이 급하다는 뜻이에요' },
      { phrase: '금리 인상 사이클', meaning: '한 번이 아니라 여러 차례 연속으로 올리는 흐름을 말해요' },
    ],
    newsQuery: '금리',

    // 기존 description/whyImportant/realExample 중 다른 필드로 못 옮긴 내용 — 접어서 보존
    moreContext: [
      '한국은행 금융통화위원회는 8주마다 기준금리를 결정해요. 이 작은 숫자가 대출 이자, 예금 수익, 주식·부동산 시장 전반을 움직여요.',
      '변동금리 대출자라면 금리 발표일을 달력에 표시해두면 좋아요.',
      '2023년 한국은행이 기준금리를 3.5%로 동결했을 때, 시장은 "곧 인하 신호"로 받아들여 채권 가격이 오르고 부동산 심리가 살아났어요.',
    ],
  },
};

export default indicatorInsights;

export function getIndicatorInsight(id) {
  return indicatorInsights[Number(id)] ?? null;
}

export function getBandForValue(bands, value) {
  return bands.find(b => value <= b.max) ?? bands[bands.length - 1];
}
