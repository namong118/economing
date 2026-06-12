import {
  Landmark, Building2, Users, ShoppingCart, TrendingUp, TrendingDown,
  Home, BarChart2, DollarSign, PiggyBank, CreditCard, Briefcase,
  Globe, ArrowUpDown, Percent, Coins, Wallet, Package,
  Factory, Ship, RefreshCw, Scale,
  AlertCircle, CheckCircle, Zap, Clock, LineChart, PieChart,
} from 'lucide-react'
import { BiteInfographic } from '../components/infographic/BiteInfographic'

export const BITE_INFOGRAPHICS = {

  1: () => (
    <BiteInfographic
      title="기준금리가 결정되는 과정"
      steps={[
        { icon: Landmark,  label: '중앙은행', sub: '금리 결정',  color: 'green'  },
        { icon: Building2, label: '시중은행', sub: '금리 적용',  color: 'yellow' },
        { icon: Wallet,    label: '내 이자',  sub: '변동',      color: 'yellow' },
      ]}
      result="모든 금리의 기준이 되는 핵심 지표"
    />
  ),

  2: () => (
    <BiteInfographic
      title="ETF 투자 구조"
      steps={[
        { icon: Package,   label: '여러 종목', sub: '한 번에',   color: 'green' },
        { icon: LineChart, label: '지수 추종', sub: '자동 구성', color: 'green' },
        { icon: PieChart,  label: '분산 투자', sub: '자동으로',  color: 'green' },
      ]}
      result="소액으로 수백 종목에 분산 투자"
    />
  ),

  3: () => (
    <BiteInfographic
      title="복리의 마법"
      steps={[
        { icon: Coins,      label: '원금',     sub: '100만원',       color: 'green'  },
        { icon: Percent,    label: '이자',     sub: '10만원 발생',   color: 'yellow' },
        { icon: TrendingUp, label: '이자+이자', sub: '다음해 11만원', color: 'green'  },
        { icon: Zap,        label: '눈덩이',   sub: '시간이 길수록', color: 'green'  },
      ]}
      result="시간이 길수록 눈덩이처럼 불어나요"
    />
  ),

  4: () => (
    <BiteInfographic
      title="인플레이션의 작동 원리"
      steps={[
        { icon: DollarSign, label: '돈 공급', sub: '시중에 증가',  color: 'green' },
        { icon: Package,    label: '물가',    sub: '전반적 상승',  color: 'red'   },
        { icon: Wallet,     label: '구매력',  sub: '점점 감소',   color: 'red'   },
      ]}
      result="물가 상승 = 돈의 가치 하락"
    />
  ),

  5: () => (
    <BiteInfographic
      title="디플레이션의 악순환"
      steps={[
        { icon: TrendingDown, label: '물가 하락',  sub: '가격 감소',    color: 'blue'   },
        { icon: Clock,        label: '소비 미룸',  sub: '"더 싸질 때"', color: 'yellow' },
        { icon: Factory,      label: '기업 위축',  sub: '매출 감소',    color: 'red'    },
        { icon: Users,        label: '일자리 감소', sub: '악순환',      color: 'red'    },
      ]}
      result="물가 하락이 경제를 멈추는 역설"
    />
  ),

  6: () => (
    <BiteInfographic
      title="GDP를 구성하는 4요소"
      steps={[
        { icon: Users,     label: '소비',     sub: '가계 지출',  color: 'green'  },
        { icon: Briefcase, label: '기업 투자', sub: '설비·R&D',  color: 'green'  },
        { icon: Landmark,  label: '정부 지출', sub: '공공서비스', color: 'green'  },
        { icon: Ship,      label: '순수출',   sub: '수출 - 수입', color: 'yellow' },
      ]}
      result="나라 경제 규모를 재는 대표 지표"
    />
  ),

  7: () => (
    <BiteInfographic
      title="배당금이 만들어지는 과정"
      steps={[
        { icon: Factory,   label: '기업 이익', sub: '연간 수익',  color: 'green' },
        { icon: Coins,     label: '배당 지급', sub: '주주에게',   color: 'green' },
        { icon: RefreshCw, label: '재투자',    sub: '복리 효과', color: 'green' },
      ]}
      result="주가 상승 없이도 생기는 현금 수입"
    />
  ),

  8: () => (
    <BiteInfographic
      title="채권 투자 구조"
      steps={[
        { icon: Landmark, label: '발행자',    sub: '정부·기업',  color: 'green'  },
        { icon: Coins,    label: '채권 매입', sub: '돈을 빌려줌', color: 'yellow' },
        { icon: Percent,  label: '이자 수령', sub: '정기적으로', color: 'green'  },
      ]}
      result="만기에 원금 + 이자를 돌려받아요"
    />
  ),

  9: () => (
    <BiteInfographic
      title="주식 투자 수익 구조"
      steps={[
        { icon: Factory,    label: '기업 성장', sub: '매출·이익 증가', color: 'green' },
        { icon: TrendingUp, label: '주가 상승', sub: '시장 평가',     color: 'green' },
        { icon: Wallet,     label: '자산 증가', sub: '주주 이익',     color: 'green' },
      ]}
      result="기업 성장의 과실을 함께 나눠요"
    />
  ),

  10: () => (
    <BiteInfographic
      title="예금 구조"
      steps={[
        { icon: Wallet,      label: '현금',    sub: '은행에 맡김',  color: 'green' },
        { icon: PiggyBank,   label: '정기예금', sub: '기간 약정',   color: 'green' },
        { icon: Percent,     label: '이자 수령', sub: '만기 시',    color: 'green' },
        { icon: CheckCircle, label: '원금 보장', sub: '5천만원까지', color: 'green' },
      ]}
      result="원금 보장 + 예금자보호 안전자산"
    />
  ),

  11: () => (
    <BiteInfographic
      title="적금으로 목돈 만들기"
      steps={[
        { icon: Coins,     label: '매달 납입', sub: '소액으로',   color: 'green'  },
        { icon: PiggyBank, label: '차곡차곡',  sub: '은행 적립',  color: 'green'  },
        { icon: Clock,     label: '만기 도래', sub: '1~2년 후',  color: 'yellow' },
        { icon: Wallet,    label: '목돈 수령', sub: '이자 포함', color: 'green'  },
      ]}
      result="강제 저축으로 만드는 첫 번째 목돈"
    />
  ),

  12: () => (
    <BiteInfographic
      title="비상금의 역할"
      steps={[
        { icon: Wallet,      label: '생활비 파악', sub: '3~6개월치',  color: 'green'  },
        { icon: PiggyBank,   label: '비상금 적립', sub: '유동성 통장', color: 'green'  },
        { icon: AlertCircle, label: '위기 상황',   sub: '실직·병원',  color: 'red'    },
        { icon: CheckCircle, label: '안전 대비',   sub: '손해 없이',  color: 'green'  },
      ]}
      result="재정의 안전벨트 — 먼저 마련해요"
    />
  ),

  13: () => (
    <BiteInfographic
      title="환율 변동의 영향"
      steps={[
        { icon: Globe,  label: '환율 변동', sub: '원/달러',   color: 'green'  },
        { icon: Ship,   label: '수출입',    sub: '유리·불리', color: 'yellow' },
        { icon: Wallet, label: '달러 자산', sub: '수익 변동', color: 'yellow' },
      ]}
      result="환율 변동이 내 자산에 미치는 영향"
    />
  ),

  14: () => (
    <BiteInfographic
      title="CPI가 금리에 미치는 영향"
      steps={[
        { icon: Package,   label: '물가 조사',  sub: '식품·교통 등', color: 'green'  },
        { icon: BarChart2, label: 'CPI 발표',   sub: '매월 통계청',  color: 'yellow' },
        { icon: Landmark,  label: '중앙은행',   sub: '목표 2%',     color: 'green'  },
        { icon: Percent,   label: '금리 결정',  sub: '인상·인하',   color: 'yellow' },
      ]}
      result="물가 측정 → 금리 결정의 핵심 지표"
    />
  ),

  15: () => (
    <BiteInfographic
      title="자산배분 전략"
      steps={[
        { icon: LineChart, label: '주식',      sub: '고수익·고위험', color: 'yellow' },
        { icon: PiggyBank, label: '채권·예금', sub: '안전자산',     color: 'green'  },
        { icon: Coins,     label: '금·현금',   sub: '방어자산',     color: 'blue'   },
        { icon: PieChart,  label: '분산 완성', sub: '리스크 분산',  color: 'green'  },
      ]}
      result="달걀을 여러 바구니에 나눠 담아요"
    />
  ),

  16: () => (
    <BiteInfographic
      title="연금 적립 과정"
      steps={[
        { icon: Coins,     label: '꾸준히 납입', sub: '매달',      color: 'green'  },
        { icon: Clock,     label: '장기 적립',   sub: '수십 년',   color: 'yellow' },
        { icon: PiggyBank, label: '노후 자산',   sub: '55세 이후', color: 'green'  },
        { icon: Wallet,    label: '연금 수령',   sub: '매달 지급', color: 'green'  },
      ]}
      result="지금의 작은 납입이 노후를 지켜요"
    />
  ),

  17: () => (
    <BiteInfographic
      title="청약 당첨까지"
      steps={[
        { icon: PiggyBank,   label: '청약통장',  sub: '꾸준히 납입',  color: 'green'  },
        { icon: BarChart2,   label: '청약 점수', sub: '기간·금액',    color: 'green'  },
        { icon: Home,        label: '분양 신청', sub: '경쟁률 높음',  color: 'yellow' },
        { icon: CheckCircle, label: '당첨',      sub: '시세보다 저렴', color: 'green'  },
      ]}
      result="빨리 만들수록 유리한 내 집 마련 티켓"
    />
  ),

  18: () => (
    <BiteInfographic
      title="포트폴리오 구성"
      steps={[
        { icon: PieChart,  label: '비율 설계', sub: '목표 배분',  color: 'green'  },
        { icon: LineChart, label: '주식',      sub: '성장 자산',  color: 'yellow' },
        { icon: PiggyBank, label: '채권·예금', sub: '방어 자산',  color: 'green'  },
        { icon: RefreshCw, label: '리밸런싱',  sub: '정기 점검', color: 'green'  },
      ]}
      result="내 투자 자산의 전체 지도"
    />
  ),

  19: () => (
    <BiteInfographic
      title="스태그플레이션의 딜레마"
      steps={[
        { icon: Ship,     label: '공급 충격',   sub: '오일쇼크 등',   color: 'red' },
        { icon: Package,  label: '물가 급등',   sub: '인플레이션 ↑', color: 'red' },
        { icon: Factory,  label: '경기 침체',   sub: '성장 둔화 ↓',  color: 'red' },
        { icon: Landmark, label: '정책 딜레마', sub: '진퇴양난',      color: 'red' },
      ]}
      result="가장 다루기 어려운 경제 위기"
    />
  ),

  20: () => (
    <BiteInfographic
      title="수익률 계산하기"
      steps={[
        { icon: Wallet,     label: '투자 원금', sub: '100만원',   color: 'green'  },
        { icon: TrendingUp, label: '수익 발생', sub: '+10만원',   color: 'green'  },
        { icon: Percent,    label: '수익률',    sub: '10% 계산',  color: 'yellow' },
        { icon: Package,    label: '실질 수익', sub: '물가 차감', color: 'yellow' },
      ]}
      result="물가를 이겨야 진짜 수익이에요"
    />
  ),

  21: () => (
    <BiteInfographic
      title="단리 이자 계산"
      steps={[
        { icon: Coins,   label: '원금',     sub: '100만원',     color: 'green'  },
        { icon: Percent, label: '이자율',   sub: '연 10%',      color: 'yellow' },
        { icon: Coins,   label: '매년 이자', sub: '10만원 고정', color: 'yellow' },
        { icon: Wallet,  label: '10년 후',  sub: '200만원',     color: 'green'  },
      ]}
      result="이자가 원금에만 붙는 단순 계산"
    />
  ),

  22: () => (
    <BiteInfographic
      title="펀드 운용 구조"
      steps={[
        { icon: Users,     label: '투자자',     sub: '돈을 모아',  color: 'green'  },
        { icon: Briefcase, label: '펀드매니저', sub: '전문 운용',  color: 'yellow' },
        { icon: PieChart,  label: '분산 투자',  sub: '여러 종목',  color: 'green'  },
        { icon: Coins,     label: '수익 배분',  sub: '수수료 차감', color: 'yellow' },
      ]}
      result="전문가에게 맡기는 간접 투자"
    />
  ),

  23: () => (
    <BiteInfographic
      title="경기침체의 악순환"
      steps={[
        { icon: TrendingDown, label: 'GDP 감소', sub: '2분기 연속', color: 'red' },
        { icon: Factory,      label: '기업 위축', sub: '채용 중단', color: 'red' },
        { icon: Users,        label: '실업 증가', sub: '소득 감소', color: 'red' },
        { icon: ShoppingCart, label: '소비 감소', sub: '악순환',   color: 'red' },
      ]}
      result="비상금으로 버티고 저가 매수 기회로"
    />
  ),

  24: () => (
    <BiteInfographic
      title="기회비용이란"
      steps={[
        { icon: Wallet,      label: '선택지',   sub: 'A안 vs B안',  color: 'green'  },
        { icon: CheckCircle, label: 'A안 선택',  sub: '결정',       color: 'green'  },
        { icon: AlertCircle, label: 'B안 포기',  sub: '기회비용',   color: 'red'    },
        { icon: Scale,       label: '비교 판단', sub: '합리적 선택', color: 'yellow' },
      ]}
      result="모든 선택에는 숨겨진 비용이 있어요"
    />
  ),

  25: () => (
    <BiteInfographic
      title="매몰비용의 함정"
      steps={[
        { icon: Wallet,      label: '이미 지출',  sub: '돌아오지 않음',   color: 'red'    },
        { icon: AlertCircle, label: '매몰비용',   sub: '판단 오류 유발',  color: 'red'    },
        { icon: Scale,       label: '미래만 보기', sub: '앞으로의 가치',  color: 'yellow' },
        { icon: CheckCircle, label: '합리적 결정', sub: '이미 쓴 돈은 잊기', color: 'green' },
      ]}
      result="이미 쓴 돈은 잊고 앞을 보세요"
    />
  ),

  26: () => (
    <BiteInfographic
      title="수요·공급이 가격을 결정"
      steps={[
        { icon: Users,   label: '수요',     sub: '사려는 사람',    color: 'green'  },
        { icon: Package, label: '공급',     sub: '팔려는 물건',    color: 'yellow' },
        { icon: Scale,   label: '균형점',   sub: '가격 결정',     color: 'yellow' },
        { icon: Coins,   label: '시장 가격', sub: '수요·공급 균형', color: 'green'  },
      ]}
      result="가격을 결정하는 경제의 기본 법칙"
    />
  ),

  27: () => (
    <BiteInfographic
      title="자산별 유동성 비교"
      steps={[
        { icon: Home,      label: '부동산',   sub: '낮음', color: 'red'    },
        { icon: PiggyBank, label: '예금·적금', sub: '중간', color: 'yellow' },
        { icon: LineChart, label: '주식',     sub: '높음', color: 'green'  },
        { icon: Wallet,    label: '현금',     sub: '최고', color: 'green'  },
      ]}
      result="급할 때 쓸 수 있는 자산이 중요해요"
    />
  ),

  28: () => (
    <BiteInfographic
      title="양적완화 경로"
      steps={[
        { icon: Landmark,   label: '중앙은행', sub: '채권 매입',  color: 'green' },
        { icon: DollarSign, label: '시중 자금', sub: '공급 증가',  color: 'green' },
        { icon: Percent,    label: '금리 하락', sub: '자연스럽게', color: 'green' },
        { icon: TrendingUp, label: '경기 부양', sub: '자산 상승',  color: 'green' },
      ]}
      result="위기 때 경제를 살리는 비상 수단"
    />
  ),

  29: () => (
    <BiteInfographic
      title="레버리지 양날의 검"
      steps={[
        { icon: Wallet,       label: '자기 자본', sub: '100만원',  color: 'green'  },
        { icon: CreditCard,   label: '대출 추가', sub: '+200만원', color: 'yellow' },
        { icon: TrendingUp,   label: '상승 시',   sub: '수익 3배', color: 'green'  },
        { icon: TrendingDown, label: '하락 시',   sub: '손실 3배', color: 'red'    },
      ]}
      result="수익도 손실도 모두 커지는 양날의 검"
    />
  ),

  30: () => (
    <BiteInfographic
      title="PER 계산과 활용"
      steps={[
        { icon: LineChart,  label: '주가',      sub: '현재 가격',    color: 'yellow' },
        { icon: DollarSign, label: '주당 순이익', sub: 'EPS',        color: 'green'  },
        { icon: BarChart2,  label: 'PER',       sub: '주가 ÷ EPS',  color: 'yellow' },
        { icon: Scale,      label: '밸류에이션', sub: '저평가·고평가', color: 'green' },
      ]}
      result="주식이 비싼지 싼지 가늠하는 잣대"
    />
  ),

  31: () => (
    <BiteInfographic
      title="퇴직연금 절세 효과"
      steps={[
        { icon: Briefcase, label: '직장인',    sub: '매달 납입',    color: 'green' },
        { icon: PiggyBank, label: 'IRP 계좌',  sub: '적립·운용',    color: 'green' },
        { icon: Percent,   label: '세액공제',  sub: '최대 148만원', color: 'green' },
        { icon: Wallet,    label: '노후 수령', sub: '55세 이후',    color: 'green' },
      ]}
      result="절세 + 노후 준비를 동시에"
    />
  ),

  32: () => (
    <BiteInfographic
      title="무역수지 흑자·적자"
      steps={[
        { icon: Ship,      label: '수출',     sub: '반도체·자동차', color: 'green'  },
        { icon: Globe,     label: '해외 교역', sub: '국제 거래',   color: 'yellow' },
        { icon: Ship,      label: '수입',     sub: '에너지·원자재', color: 'yellow' },
        { icon: BarChart2, label: '무역수지', sub: '흑자 or 적자', color: 'green'  },
      ]}
      result="수출 > 수입이면 흑자 = 외화 유입"
    />
  ),

  33: () => (
    <BiteInfographic
      title="실업률과 경기의 관계"
      steps={[
        { icon: Users,       label: '경제활동인구', sub: '일할 의지',    color: 'green'  },
        { icon: AlertCircle, label: '실업자',       sub: '직업 없음',    color: 'red'    },
        { icon: Percent,     label: '실업률',       sub: '비율 산출',    color: 'yellow' },
        { icon: Landmark,    label: '중앙은행',     sub: '금리 결정 참고', color: 'green' },
      ]}
      result="경기 온도계 — 낮을수록 경기 좋음"
    />
  ),

  34: () => (
    <BiteInfographic
      title="공매도 수익 구조"
      steps={[
        { icon: CreditCard,   label: '주식 차입', sub: '빌려서',    color: 'yellow' },
        { icon: TrendingDown, label: '고가 매도', sub: '하락 예상', color: 'red'    },
        { icon: Coins,        label: '저가 매수', sub: '하락 후',   color: 'green'  },
        { icon: Wallet,       label: '차익 실현', sub: '차이만큼',  color: 'green'  },
      ]}
      result="하락 베팅 — 이론상 손실은 무제한"
    />
  ),

  35: () => (
    <BiteInfographic
      title="코스피 지수 구조"
      steps={[
        { icon: Factory,    label: '한국 대형주', sub: '삼성전자 등', color: 'green'  },
        { icon: LineChart,  label: '주가 종합',   sub: '전체 집계',  color: 'yellow' },
        { icon: BarChart2,  label: '코스피 지수', sub: '경제 척도',  color: 'green'  },
        { icon: TrendingUp, label: 'ETF 투자',   sub: '지수 추종',  color: 'green'  },
      ]}
      result="한국 주식 시장의 대표 지수"
    />
  ),

  36: () => (
    <BiteInfographic
      title="인덱스 펀드 전략"
      steps={[
        { icon: BarChart2,  label: '시장 지수',  sub: 'S&P500·코스피', color: 'green' },
        { icon: RefreshCw,  label: '그대로 추종', sub: '자동 구성',    color: 'green' },
        { icon: Percent,    label: '낮은 수수료', sub: '0.01~0.05%',  color: 'green' },
        { icon: TrendingUp, label: '장기 복리',   sub: '연평균 ~10%',  color: 'green' },
      ]}
      result="전문가도 못 이기는 시장 평균 전략"
    />
  ),

  37: () => (
    <BiteInfographic
      title="금리 인상이 경제에 미치는 효과"
      steps={[
        { icon: Landmark,     label: '중앙은행',  sub: '기준금리 ↑', color: 'green'  },
        { icon: Building2,    label: '시중은행',  sub: '대출금리 ↑', color: 'yellow' },
        { icon: Users,        label: '가계·기업', sub: '이자 부담 ↑', color: 'red'   },
        { icon: ShoppingCart, label: '소비·투자', sub: '지출 감소',  color: 'red'    },
      ]}
      result="결과: 물가 안정 · 경기 냉각"
    />
  ),

  38: () => (
    <BiteInfographic
      title="금리 인하가 경제에 미치는 효과"
      steps={[
        { icon: Landmark,     label: '중앙은행',  sub: '기준금리 ↓', color: 'green' },
        { icon: Building2,    label: '시중은행',  sub: '대출금리 ↓', color: 'green' },
        { icon: Users,        label: '가계·기업', sub: '이자 부담 ↓', color: 'green' },
        { icon: ShoppingCart, label: '소비·투자', sub: '지출 증가',  color: 'green' },
      ]}
      result="결과: 경기 부양 · 물가 상승 가능"
    />
  ),

  39: () => (
    <BiteInfographic
      title="재무제표 3대 구성"
      steps={[
        { icon: Factory,   label: '기업 경영',  sub: '사업 활동', color: 'green'  },
        { icon: LineChart, label: '손익계산서', sub: '수익·비용', color: 'yellow' },
        { icon: Scale,     label: '재무상태표', sub: '자산·부채', color: 'yellow' },
        { icon: Wallet,    label: '현금흐름표', sub: '실제 현금', color: 'green'  },
      ]}
      result="기업의 재정 건강을 보는 X-레이"
    />
  ),

  40: () => (
    <BiteInfographic
      title="배당수익률 계산"
      steps={[
        { icon: Factory,   label: '배당주',     sub: '안정 기업',    color: 'green'  },
        { icon: Coins,     label: '배당금',     sub: '주당 5,000원', color: 'green'  },
        { icon: LineChart, label: '주가',       sub: '10만원 기준',  color: 'yellow' },
        { icon: Percent,   label: '배당수익률', sub: '5% 계산',      color: 'green'  },
      ]}
      result="주가 상승 없이도 받는 현금 수입"
    />
  ),

  41: () => (
    <BiteInfographic
      title="달러 인덱스와 환율"
      steps={[
        { icon: DollarSign,  label: '달러',       sub: '세계 기축통화', color: 'green'  },
        { icon: Globe,       label: '6개국 통화', sub: '대비 측정',    color: 'yellow' },
        { icon: BarChart2,   label: '달러 인덱스', sub: '강약 수치화', color: 'yellow' },
        { icon: ArrowUpDown, label: '환율 영향',  sub: '원화 강·약세', color: 'red'    },
      ]}
      result="달러 강세 = 원화 약세 = 수입물가 상승"
    />
  ),

  42: () => (
    <BiteInfographic
      title="규모의 경제 효과"
      steps={[
        { icon: Factory,    label: '소규모',     sub: '개당 비용 높음', color: 'red'    },
        { icon: TrendingUp, label: '생산량 증가', sub: '대량 생산',    color: 'yellow' },
        { icon: Package,    label: '단위 비용',  sub: '급격히 감소',  color: 'green'  },
        { icon: Briefcase,  label: '경쟁 우위',  sub: '시장 지배력',  color: 'green'  },
      ]}
      result="많이 만들수록 싸지는 경제 법칙"
    />
  ),

  43: () => (
    <BiteInfographic
      title="자산의 종류"
      steps={[
        { icon: Home,      label: '실물자산', sub: '부동산·자동차',  color: 'green'  },
        { icon: LineChart, label: '금융자산', sub: '주식·채권·예금', color: 'green'  },
        { icon: Scale,     label: '순자산',   sub: '자산 - 부채',   color: 'yellow' },
        { icon: Wallet,    label: '재정 건강', sub: '꾸준히 늘리기', color: 'green'  },
      ]}
      result="내가 가진 모든 경제적 가치"
    />
  ),

  44: () => (
    <BiteInfographic
      title="부채가 쌓이는 구조"
      steps={[
        { icon: CreditCard,   label: '대출',    sub: '빌린 돈',        color: 'yellow' },
        { icon: Percent,      label: '이자 누적', sub: '시간이 갈수록', color: 'red'   },
        { icon: TrendingDown, label: '순자산',   sub: '감소',          color: 'red'    },
        { icon: AlertCircle,  label: '위험',     sub: '고금리 먼저 갚기', color: 'red'  },
      ]}
      result="고금리 부채는 어떤 투자보다 먼저 갚아요"
    />
  ),

  45: () => (
    <BiteInfographic
      title="경상수지 구성"
      steps={[
        { icon: Ship,       label: '무역수지', sub: '수출 - 수입', color: 'green'  },
        { icon: Globe,      label: '서비스수지', sub: '유학·여행', color: 'yellow' },
        { icon: DollarSign, label: '소득수지',  sub: '배당·이자', color: 'green'  },
        { icon: BarChart2,  label: '경상수지',  sub: '종합 결산', color: 'green'  },
      ]}
      result="한국의 국제 거래 종합 성적표"
    />
  ),

  46: () => (
    <BiteInfographic
      title="소득세 납부 흐름"
      steps={[
        { icon: Wallet,   label: '소득 발생', sub: '근로·사업 소득', color: 'green'  },
        { icon: Percent,  label: '누진세율',  sub: '소득별 차등',   color: 'yellow' },
        { icon: Landmark, label: '세금 납부', sub: '원천징수',      color: 'yellow' },
        { icon: Coins,    label: '연말정산',  sub: '환급 또는 추납', color: 'green'  },
      ]}
      result="많이 벌수록 세율 높아지는 누진세"
    />
  ),

  47: () => (
    <BiteInfographic
      title="가처분소득 계산"
      steps={[
        { icon: Wallet,      label: '세전 급여', sub: '월 300만원',         color: 'green'  },
        { icon: Percent,     label: '세금·보험', sub: '10~15% 공제',        color: 'red'    },
        { icon: Coins,       label: '실수령액',  sub: '약 250만원',         color: 'yellow' },
        { icon: CheckCircle, label: '가처분소득', sub: '실제 쓸 수 있는 돈', color: 'green'  },
      ]}
      result="세금 빼고 실제로 쓸 수 있는 돈"
    />
  ),

  48: () => (
    <BiteInfographic
      title="S&P 500 투자 효과"
      steps={[
        { icon: Factory,    label: '미국 500대', sub: '애플·MS·아마존', color: 'green'  },
        { icon: BarChart2,  label: 'S&P 500',   sub: '지수 추종',      color: 'yellow' },
        { icon: TrendingUp, label: '연평균 수익', sub: '약 10%',        color: 'green'  },
        { icon: Coins,      label: '장기 복리',  sub: '자산 성장',      color: 'green'  },
      ]}
      result="미국 경제와 함께 성장하는 지수"
    />
  ),

  49: () => (
    <BiteInfographic
      title="금이 안전자산인 이유"
      steps={[
        { icon: AlertCircle, label: '경제 불안', sub: '위기·전쟁',      color: 'red'    },
        { icon: Coins,       label: '금 매수',   sub: '안전자산 선호', color: 'yellow' },
        { icon: TrendingUp,  label: '금 가격',   sub: '상승',          color: 'green'  },
        { icon: CheckCircle, label: '가치 보존', sub: '오래된 안전자산', color: 'green' },
      ]}
      result="불확실성이 클수록 가치 빛나는 안전자산"
    />
  ),

  50: () => (
    <BiteInfographic
      title="긴축정책의 효과"
      steps={[
        { icon: Landmark,     label: '중앙은행', sub: '금리 인상',       color: 'red'   },
        { icon: DollarSign,   label: '통화량',   sub: '공급 축소',       color: 'red'   },
        { icon: Package,      label: '물가',     sub: '상승 억제',       color: 'green' },
        { icon: TrendingDown, label: '자산 가격', sub: '주식·부동산 하락', color: 'red'  },
      ]}
      result="인플레이션 잡기 위한 경제 냉각 처방"
    />
  ),

  51: () => (
    <BiteInfographic
      title="부가가치세 흐름"
      steps={[
        { icon: ShoppingCart, label: '소비자',    sub: '물건 구입',  color: 'green'  },
        { icon: Percent,      label: '부가세 10%', sub: '자동 포함', color: 'yellow' },
        { icon: Briefcase,    label: '사업자',    sub: '부가세 수취', color: 'yellow' },
        { icon: Landmark,     label: '국세청',    sub: '납부',       color: 'green'  },
      ]}
      result="소비할 때마다 자동으로 내는 세금"
    />
  ),

  52: () => (
    <BiteInfographic
      title="할인율로 현재 가치 계산"
      steps={[
        { icon: Clock,   label: '미래 가치',  sub: '10년 후 100만원', color: 'yellow' },
        { icon: Percent, label: '할인율 적용', sub: '연 10%',         color: 'yellow' },
        { icon: Coins,   label: '현재 가치',  sub: '약 38만원',       color: 'green'  },
        { icon: Scale,   label: '투자 판단',  sub: '미래vs현재',      color: 'green'  },
      ]}
      result="미래의 돈 = 지금보다 작은 가치"
    />
  ),

  53: () => (
    <BiteInfographic
      title="신용등급이 만들어지는 과정"
      steps={[
        { icon: CreditCard,  label: '결제 이력', sub: '연체·납부 기록', color: 'yellow' },
        { icon: BarChart2,   label: '신용등급',  sub: '점수 산출',     color: 'green'  },
        { icon: Percent,     label: '대출 금리', sub: '등급별 차등',   color: 'yellow' },
        { icon: CheckCircle, label: '좋은 신용', sub: '낮은 금리 혜택', color: 'green'  },
      ]}
      result="신용은 제때 갚는 습관으로 만들어져요"
    />
  ),

  54: () => (
    <BiteInfographic
      title="PBR 계산과 활용"
      steps={[
        { icon: LineChart, label: '주가',      sub: '현재 시장가',       color: 'yellow' },
        { icon: Scale,     label: '순자산',    sub: '장부 자산 - 부채',  color: 'green'  },
        { icon: BarChart2, label: 'PBR',       sub: '주가 ÷ 순자산',    color: 'yellow' },
        { icon: Coins,     label: '가치 평가', sub: '1 이하 저평가 가능', color: 'green'  },
      ]}
      result="장부 가치 대비 주가 수준을 확인해요"
    />
  ),

  55: () => (
    <BiteInfographic
      title="경제적 해자의 작동 원리"
      steps={[
        { icon: Briefcase,   label: '기업 우위',  sub: '브랜드·기술·네트워크', color: 'green' },
        { icon: AlertCircle, label: '경쟁 진입',  sub: '어렵고 비쌈',         color: 'red'   },
        { icon: TrendingUp,  label: '시장 지배',  sub: '지속 유지',           color: 'green' },
        { icon: Coins,       label: '장기 수익',  sub: '꾸준히 창출',         color: 'green' },
      ]}
      result="경쟁자가 넘볼 수 없는 기업의 강점"
    />
  ),

  56: () => (
    <BiteInfographic
      title="4대보험 보장 영역"
      steps={[
        { icon: Briefcase,   label: '직장 가입',    sub: '자동 등록',  color: 'green' },
        { icon: Users,       label: '국민연금',      sub: '노후 대비', color: 'green' },
        { icon: Building2,   label: '건강·고용보험', sub: '의료·실업', color: 'green' },
        { icon: CheckCircle, label: '산재보험',      sub: '업무 사고', color: 'green' },
      ]}
      result="직장인의 기본 사회 안전망"
    />
  ),

  57: () => (
    <BiteInfographic
      title="시가총액 계산"
      steps={[
        { icon: LineChart, label: '주가',      sub: '현재 주식 가격', color: 'yellow' },
        { icon: Coins,     label: '발행 주식수', sub: '총 주식 수량', color: 'green'  },
        { icon: BarChart2, label: '시가총액',  sub: '주가 × 주식수', color: 'yellow' },
        { icon: Factory,   label: '기업 가치', sub: '시장 평가액',   color: 'green'  },
      ]}
      result="기업의 시장 가치를 한눈에"
    />
  ),

  58: () => (
    <BiteInfographic
      title="전세 제도 구조"
      steps={[
        { icon: Wallet,      label: '보증금',   sub: '집값의 50~80%', color: 'green'  },
        { icon: Home,        label: '무상 거주', sub: '월세 없이',    color: 'green'  },
        { icon: AlertCircle, label: '위험',     sub: '사기·집값 하락', color: 'red'   },
        { icon: CheckCircle, label: '보증보험',  sub: '안전장치',     color: 'green'  },
      ]}
      result="한국 특유의 제도 — 계약 전 등기 확인 필수"
    />
  ),

  59: () => (
    <BiteInfographic
      title="리밸런싱 과정"
      steps={[
        { icon: PieChart,   label: '목표 비율', sub: '주식60·채권40', color: 'green'  },
        { icon: TrendingUp, label: '주식 상승', sub: '비율 틀어짐',   color: 'yellow' },
        { icon: RefreshCw,  label: '리밸런싱',  sub: '원래대로 조정', color: 'green'  },
        { icon: Scale,      label: '균형 회복', sub: '위험 관리',    color: 'green'  },
      ]}
      result="오른 것 팔고 싼 것 사는 자동 전략"
    />
  ),

  60: () => (
    <BiteInfographic
      title="인플레이션 헤지 전략"
      steps={[
        { icon: Package,    label: '인플레이션', sub: '물가 상승',      color: 'red'   },
        { icon: Wallet,     label: '현금',      sub: '가치 하락',      color: 'red'   },
        { icon: Coins,      label: '헤지 자산', sub: '금·주식·부동산', color: 'green' },
        { icon: TrendingUp, label: '실질 가치', sub: '보존·성장',      color: 'green' },
      ]}
      result="인플레이션이 와도 자산 가치를 지켜요"
    />
  ),
}

export function getBiteInfographic(id) {
  return BITE_INFOGRAPHICS[Number(id)] ?? null
}
