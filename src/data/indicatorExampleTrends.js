/* 실시간 데이터가 없는 8개 지표용 "예시 그래프" — 실제 통계청/한국은행 수치가 아닌
   개념 설명용 일러스트레이션 데이터. StaticTrendChart에 isExample=true로 전달됨 */

const indicatorExampleTrends = {
  // 63: 소비자물가지수(CPI) 읽기 — 완만한 둔화 흐름
  63: {
    unit: '%',
    data: [
      { label: '8개월 전', value: 3.8 },
      { label: '7개월 전', value: 3.4 },
      { label: '6개월 전', value: 3.1 },
      { label: '5개월 전', value: 2.9 },
      { label: '4개월 전', value: 2.7 },
      { label: '3개월 전', value: 2.6 },
      { label: '2개월 전', value: 2.4 },
      { label: '지난달',   value: 2.5 },
      { label: '이번달',   value: 2.3 },
    ],
  },
  // 64: 기준금리 발표 읽기 — 계단식으로 변하는 특성 (매달 조금씩 바뀌지 않음)
  64: {
    unit: '%',
    data: [
      { label: '8개월 전', value: 3.50 },
      { label: '7개월 전', value: 3.50 },
      { label: '6개월 전', value: 3.25 },
      { label: '5개월 전', value: 3.25 },
      { label: '4개월 전', value: 3.25 },
      { label: '3개월 전', value: 3.00 },
      { label: '2개월 전', value: 3.00 },
      { label: '지난달',   value: 3.00 },
      { label: '이번달',   value: 3.00 },
    ],
  },
  // 65: 무역수지 보기 — 흑자/적자를 오가는 흐름 (0선을 넘나듦)
  65: {
    unit: '억달러',
    data: [
      { label: '8개월 전', value: -15 },
      { label: '7개월 전', value: -8 },
      { label: '6개월 전', value: 5 },
      { label: '5개월 전', value: 12 },
      { label: '4개월 전', value: 20 },
      { label: '3개월 전', value: 15 },
      { label: '2개월 전', value: 8 },
      { label: '지난달',   value: -5 },
      { label: '이번달',   value: -12 },
    ],
  },
  // 66: 실업률 지표 읽기 — 3%대에서 소폭 등락
  66: {
    unit: '%',
    data: [
      { label: '8개월 전', value: 2.9 },
      { label: '7개월 전', value: 3.0 },
      { label: '6개월 전', value: 3.2 },
      { label: '5개월 전', value: 3.4 },
      { label: '4개월 전', value: 3.1 },
      { label: '3개월 전', value: 2.9 },
      { label: '2개월 전', value: 2.8 },
      { label: '지난달',   value: 3.0 },
      { label: '이번달',   value: 3.1 },
    ],
  },
  // 67: GDP 성장률 읽기 — 분기 단위 회복 흐름
  67: {
    unit: '%',
    data: [
      { label: '6분기 전', value: 1.4 },
      { label: '5분기 전', value: 1.3 },
      { label: '4분기 전', value: 1.5 },
      { label: '3분기 전', value: 1.8 },
      { label: '2분기 전', value: 2.0 },
      { label: '지난 분기', value: 2.2 },
      { label: '이번 분기', value: 2.1 },
    ],
  },
  // 68: PER로 주식 비싸고 싼지 보기 — 과열 후 조정되는 버블성 패턴
  68: {
    unit: '배',
    data: [
      { label: '8개월 전', value: 8 },
      { label: '7개월 전', value: 9 },
      { label: '6개월 전', value: 11 },
      { label: '5개월 전', value: 14 },
      { label: '4개월 전', value: 18 },
      { label: '3개월 전', value: 22 },
      { label: '2개월 전', value: 19 },
      { label: '지난달',   value: 15 },
      { label: '이번달',   value: 12 },
    ],
  },
  // 69: 장단기 금리 역전 — 스프레드가 0 밑으로 내려갔다가(역전) 회복
  69: {
    unit: '%p',
    data: [
      { label: '7개월 전', value: 0.8 },
      { label: '6개월 전', value: 0.5 },
      { label: '5개월 전', value: 0.2 },
      { label: '4개월 전', value: -0.1 },
      { label: '3개월 전', value: -0.4 },
      { label: '2개월 전', value: -0.6 },
      { label: '지난달',   value: -0.3 },
      { label: '이번달',   value: 0.1 },
    ],
  },
  // 70: 공포탐욕지수 — 극도 공포까지 떨어졌다가 회복되는 심리 지표
  70: {
    unit: '',
    data: [
      { label: '8개월 전', value: 72 },
      { label: '7개월 전', value: 58 },
      { label: '6개월 전', value: 41 },
      { label: '5개월 전', value: 22 },
      { label: '4개월 전', value: 15 },
      { label: '3개월 전', value: 28 },
      { label: '2개월 전', value: 45 },
      { label: '지난달',   value: 63 },
      { label: '이번달',   value: 78 },
    ],
  },
};

export default indicatorExampleTrends;
