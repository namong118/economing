import {
  Landmark, Building2, Users, ShoppingCart, TrendingUp, TrendingDown,
  Home, BarChart2, DollarSign, PiggyBank, CreditCard, Briefcase,
  Globe, ArrowUpDown, Percent, Coins, Wallet, Package,
  Factory, Ship, RefreshCw, Scale,
  AlertCircle, CheckCircle, Zap, Clock, LineChart, PieChart,
  Eye, ArrowDown, ShoppingBasket, Bell, UserX, AlertTriangle,
  Minus, Droplet, Truck, Calculator,
  Phone, MessageSquare, Link2, ShieldAlert, Heart, Banknote, KeyRound, Smartphone,
} from 'lucide-react'
import { BiteInfographic } from '../components/infographic/BiteInfographic'
import { CompositionInfographic } from '../components/infographic/CompositionInfographic'
import { ComparisonInfographic } from '../components/infographic/ComparisonInfographic'

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
    <CompositionInfographic
      title="GDP를 구성하는 4요소"
      items={[
        { icon: Users,     label: '소비',     sub: '가계 지출',   color: 'green'  },
        { icon: Briefcase, label: '기업 투자', sub: '설비·R&D',   color: 'green'  },
        { icon: Landmark,  label: '정부 지출', sub: '공공서비스',  color: 'green'  },
        { icon: Ship,      label: '순수출',   sub: '수출 - 수입', color: 'yellow' },
      ]}
      total={{ icon: Globe, label: 'GDP', sub: '네 가지의 합', color: 'blue' }}
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
    <CompositionInfographic
      title="자산배분 전략"
      items={[
        { icon: LineChart, label: '주식',      sub: '고수익·고위험', color: 'yellow' },
        { icon: PiggyBank, label: '채권·예금', sub: '안전자산',     color: 'green'  },
        { icon: Coins,     label: '금·현금',   sub: '방어자산',     color: 'blue'   },
      ]}
      total={{ icon: PieChart, label: '분산 완성', sub: '리스크 분산', color: 'green' }}
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
    <CompositionInfographic
      title="포트폴리오 구성"
      items={[
        { icon: LineChart, label: '주식', sub: '성장 자산',   color: 'yellow' },
        { icon: PiggyBank, label: '채권', sub: '방어 자산',   color: 'green'  },
        { icon: Wallet,    label: '현금', sub: '유동성 확보', color: 'blue'   },
        { icon: Coins,     label: '금',   sub: '안전자산',    color: 'blue'   },
      ]}
      total={{ icon: PieChart, label: '포트폴리오', sub: '분산 완성', color: 'green' }}
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
    <ComparisonInfographic
      title="레버리지 양날의 검"
      branches={[
        { icon: TrendingUp,   label: '상승 시', sub: '수익 3배로 확대', color: 'green' },
        { icon: TrendingDown, label: '하락 시', sub: '손실 3배로 확대', color: 'red'   },
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
    <CompositionInfographic
      title="재무제표 3대 구성"
      items={[
        { icon: LineChart, label: '손익계산서', sub: '수익·비용', color: 'yellow' },
        { icon: Scale,     label: '재무상태표', sub: '자산·부채', color: 'yellow' },
        { icon: Wallet,    label: '현금흐름표', sub: '실제 현금', color: 'green'  },
      ]}
      total={{ icon: Factory, label: '재무제표', sub: '3대 구성의 합', color: 'green' }}
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
    <CompositionInfographic
      title="자산의 종류"
      items={[
        { icon: Home,      label: '실물자산', sub: '부동산·자동차',  color: 'green' },
        { icon: LineChart, label: '금융자산', sub: '주식·채권·예금', color: 'green' },
      ]}
      total={{ icon: Wallet, label: '자산', sub: '실물+금융의 합', color: 'blue' }}
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
    <CompositionInfographic
      title="경상수지 구성"
      items={[
        { icon: Ship,       label: '무역수지',   sub: '수출 - 수입', color: 'green'  },
        { icon: Globe,      label: '서비스수지', sub: '유학·여행',   color: 'yellow' },
        { icon: DollarSign, label: '소득수지',   sub: '배당·이자',   color: 'green'  },
      ]}
      total={{ icon: BarChart2, label: '경상수지', sub: '종합 결산', color: 'green' }}
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
    <CompositionInfographic
      title="4대보험 보장 영역"
      items={[
        { icon: Users,       label: '국민연금', sub: '노후 대비', color: 'green' },
        { icon: Droplet,     label: '건강보험', sub: '의료비',   color: 'green' },
        { icon: Building2,   label: '고용보험', sub: '실업급여', color: 'green' },
        { icon: CheckCircle, label: '산재보험', sub: '업무 사고', color: 'green' },
      ]}
      total={{ icon: Briefcase, label: '4대보험', sub: '직장인 필수 공제', color: 'blue' }}
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

  /* ── 지표읽기 (61~70) ────────────────────────────────── */
  61: () => (
    <BiteInfographic
      title="코스피 지수 읽기"
      steps={[
        { icon: TrendingDown, label: '지수 하락',  sub: '2600→2500',    color: 'red'    },
        { icon: BarChart2,    label: '시가총액',   sub: '상장기업 합산', color: 'blue'   },
        { icon: TrendingUp,   label: '경기 반영',  sub: '실물경제 신호', color: 'green'  },
        { icon: Eye,          label: '내 투자',    sub: '펀드/ETF 영향', color: 'yellow' },
      ]}
      result="코스피는 한국 경제의 체온계예요"
    />
  ),

  62: () => (
    <ComparisonInfographic
      title="환율 오르면(원화 약세)"
      branches={[
        { icon: ShoppingCart, label: '수입품 인상', sub: '해외직구 비용↑', color: 'red'   },
        { icon: Package,      label: '수출 유리',   sub: '기업 경쟁력↑',   color: 'green' },
      ]}
      result="환율 오르면 수입은 비싸지고 수출은 유리해져요"
    />
  ),

  63: () => (
    <BiteInfographic
      title="소비자물가지수(CPI)"
      steps={[
        { icon: ShoppingBasket, label: 'CPI 측정',  sub: '장바구니 가격',  color: 'blue'   },
        { icon: TrendingUp,     label: '3% 상승',   sub: '작년보다 비싸짐', color: 'red'    },
        { icon: Wallet,         label: '구매력 하락', sub: '같은 돈으로 덜', color: 'yellow' },
        { icon: Bell,           label: '금리 인상',  sub: '한은 대응 신호', color: 'green'  },
      ]}
      result="CPI가 오르면 내 월급의 실질 가치가 줄어요"
    />
  ),

  64: () => (
    <ComparisonInfographic
      title="기준금리 인상 시"
      branches={[
        { icon: CreditCard, label: '대출이자↑', sub: '변동금리 직격',  color: 'red'   },
        { icon: PiggyBank,  label: '예금이자↑', sub: '저축 유리해짐', color: 'green' },
      ]}
      result="기준금리는 모든 금리의 기준이 돼요"
    />
  ),

  65: () => (
    <BiteInfographic
      title="무역수지 보기"
      steps={[
        { icon: Package,      label: '수출',    sub: '해외에 파는 것',  color: 'green'  },
        { icon: ShoppingCart, label: '수입',    sub: '해외서 사는 것',  color: 'red'    },
        { icon: Scale,        label: '무역수지', sub: '수출-수입',      color: 'blue'   },
        { icon: TrendingDown, label: '적자 영향', sub: '환율·외환 압박', color: 'yellow' },
      ]}
      result="수출 > 수입이면 흑자, 경제에 좋은 신호예요"
    />
  ),

  66: () => (
    <BiteInfographic
      title="실업률 지표 읽기"
      steps={[
        { icon: Users,        label: '경제활동인구', sub: '일할 의사 있는 사람', color: 'blue'   },
        { icon: UserX,        label: '실업자',      sub: '구직 중이나 미취업',  color: 'red'    },
        { icon: TrendingUp,   label: '실업률 상승',  sub: '경기 침체 신호',     color: 'yellow' },
        { icon: Briefcase,    label: '고용시장',     sub: '취업 난이도 반영',   color: 'green'  },
      ]}
      result="실업률 오르면 경기가 나빠지는 신호예요"
    />
  ),

  67: () => (
    <ComparisonInfographic
      title="GDP 성장률"
      branches={[
        { icon: TrendingUp,   label: '성장률 +2%', sub: '경제 확장 중',   color: 'green' },
        { icon: TrendingDown, label: '성장률 -1%', sub: '경기 침체 신호', color: 'red'   },
      ]}
      result="성장률에 따라 취업·임금까지 갈리는 나라 경제의 성적표"
    />
  ),

  68: () => (
    <BiteInfographic
      title="주가수익비율(PER)"
      steps={[
        { icon: DollarSign,  label: '주가',      sub: '현재 주식 가격',    color: 'blue'   },
        { icon: BarChart2,   label: '주당순이익', sub: '1주당 버는 돈',    color: 'green'  },
        { icon: Calculator,  label: 'PER 계산',  sub: '주가 ÷ 순이익',    color: 'yellow' },
        { icon: Scale,       label: '고평가 판단', sub: 'PER 높을수록 비쌈', color: 'red'   },
      ]}
      result="PER로 주식이 싼지 비싼지 판단해요"
    />
  ),

  69: () => (
    <ComparisonInfographic
      title="장단기 금리 역전"
      branches={[
        { icon: TrendingUp,   label: '단기금리↑', sub: '2년물 금리 상승',  color: 'red'    },
        { icon: TrendingDown, label: '장기금리↓', sub: '10년물 금리 하락', color: 'yellow' },
      ]}
      result="역전 발생(단기 > 장기) = 경기침체 전조 신호"
    />
  ),

  70: () => (
    <BiteInfographic
      title="공포탐욕지수"
      steps={[
        { icon: AlertTriangle, label: '극도 공포',  sub: '지수 0~25',    color: 'red'    },
        { icon: Minus,         label: '중립',       sub: '지수 45~55',   color: 'blue'   },
        { icon: TrendingUp,    label: '극도 탐욕',  sub: '지수 75~100',  color: 'yellow' },
        { icon: ShoppingCart,  label: '역발상 투자', sub: '공포일 때 매수?', color: 'green' },
      ]}
      result="공포일 때 사고 탐욕일 때 파는 역발상 전략이 있어요"
    />
  ),

  /* ── 실생활경제 (71~80) ──────────────────────────────── */
  71: () => (
    <BiteInfographic
      title="기름값이 오르면"
      steps={[
        { icon: Droplet,      label: '유가 상승',  sub: '배럴당 $80→$100', color: 'red'    },
        { icon: Truck,        label: '운송비↑',   sub: '물류비 전반 인상', color: 'yellow' },
        { icon: ShoppingCart, label: '물가 상승',  sub: '생필품 가격↑',    color: 'red'    },
        { icon: TrendingDown, label: '소비 위축',  sub: '가처분소득 감소',  color: 'blue'   },
      ]}
      result="기름값 오르면 모든 물가가 연쇄적으로 올라요"
    />
  ),

  72: () => (
    <BiteInfographic
      title="금리가 오르면 내 대출은"
      steps={[
        { icon: TrendingUp,  label: '기준금리↑',  sub: '0.25% 인상',         color: 'red'    },
        { icon: CreditCard,  label: '변동금리↑',  sub: '대출이자 상승',       color: 'red'    },
        { icon: Calculator,  label: '월 이자 계산', sub: '3억 × 1% = 25만원↑', color: 'yellow' },
        { icon: Wallet,      label: '가처분소득↓', sub: '생활비 압박',         color: 'blue'   },
      ]}
      result="금리 1% 오르면 3억 대출 월이자 25만원 늘어요"
    />
  ),

  73: () => (
    <BiteInfographic
      title="환율이 오르면 장바구니는"
      steps={[
        { icon: DollarSign,     label: '환율 상승',  sub: '1300→1400원',   color: 'red'    },
        { icon: Package,        label: '수입원가↑',  sub: '밀·커피·원유',  color: 'yellow' },
        { icon: ShoppingBasket, label: '식품가격↑',  sub: '빵·라면·과자',  color: 'red'    },
        { icon: Wallet,         label: '생활비↑',   sub: '월 소비 부담',   color: 'blue'   },
      ]}
      result="환율 100원 오르면 수입 식품값 5~10% 올라요"
    />
  ),

  74: () => (
    <BiteInfographic
      title="아파트값과 금리의 관계"
      steps={[
        { icon: TrendingUp,   label: '금리 인상', sub: '대출 부담 증가',  color: 'red'    },
        { icon: Home,         label: '수요 감소', sub: '집 살 여력 줄어', color: 'yellow' },
        { icon: TrendingDown, label: '집값 하락', sub: '수요 감소 반영',  color: 'blue'   },
      ]}
      result="금리와 집값은 반대로 움직이는 경향이 있어요"
    />
  ),

  75: () => (
    <BiteInfographic
      title="최저임금 오르면 물가도 오를까"
      steps={[
        { icon: TrendingUp,   label: '최저임금↑', sub: '10% 인상',      color: 'green'  },
        { icon: Users,        label: '인건비↑',   sub: '사업주 부담 증가', color: 'yellow' },
        { icon: ShoppingCart, label: '가격 전가',  sub: '치킨·커피값↑',  color: 'red'    },
        { icon: Scale,        label: '복잡한 균형', sub: '소비↑ vs 물가↑', color: 'blue'  },
      ]}
      result="최저임금 인상은 소득도 오르지만 물가도 올려요"
    />
  ),

  76: () => (
    <BiteInfographic
      title="전기요금 오르면 경제는"
      steps={[
        { icon: Zap,          label: '전기료↑',  sub: '20% 인상',      color: 'yellow' },
        { icon: Factory,      label: '제조원가↑', sub: '기업 비용 증가', color: 'red'    },
        { icon: ShoppingCart, label: '제품가↑',  sub: '소비자 가격 전가', color: 'red'   },
        { icon: TrendingDown, label: '기업수익↓', sub: '수익성 악화',    color: 'blue'   },
      ]}
      result="전기요금 오르면 제조업부터 소비자까지 다 영향받아요"
    />
  ),

  77: () => (
    <BiteInfographic
      title="주식 폭락하면 내 연금은"
      steps={[
        { icon: TrendingDown, label: '코스피 -30%', sub: '시장 급락',      color: 'red'    },
        { icon: PiggyBank,    label: 'IRP/퇴직연금', sub: '주식형 비중 하락', color: 'yellow' },
        { icon: Calculator,   label: '수익률 하락',  sub: '원금 손실 가능', color: 'red'    },
        { icon: Clock,        label: '장기 관점',   sub: '시간이 회복시켜', color: 'green'  },
      ]}
      result="연금은 장기 투자라 단기 폭락에 흔들리지 않아도 돼요"
    />
  ),

  78: () => (
    <BiteInfographic
      title="중국 경제 흔들리면 한국은"
      steps={[
        { icon: TrendingDown, label: '중국 성장↓', sub: '5%→3%로 하락',  color: 'red'    },
        { icon: Package,      label: '수출 감소',  sub: '한국 대중 수출↓', color: 'yellow' },
        { icon: DollarSign,   label: '환율 상승',  sub: '원화 약세 압박',  color: 'red'    },
        { icon: TrendingDown, label: '주식 하락',  sub: '코스피 동반 하락', color: 'blue'   },
      ]}
      result="중국은 한국 최대 수출국이라 영향이 커요"
    />
  ),

  79: () => (
    <BiteInfographic
      title="미국 금리가 오르면 한국은"
      steps={[
        { icon: TrendingUp,   label: '미 연준 인상', sub: 'Fed 금리↑',    color: 'red'    },
        { icon: DollarSign,   label: '달러 강세',   sub: '자본 미국으로', color: 'yellow' },
        { icon: TrendingDown, label: '원화 약세',   sub: '환율 상승',     color: 'red'    },
        { icon: ArrowDown,    label: '외국인 매도',  sub: '한국 주식 이탈', color: 'blue'  },
      ]}
      result="미국 금리 오르면 달러 강세로 한국 자본이 빠져나가요"
    />
  ),

  80: () => (
    <BiteInfographic
      title="내 월급의 실질 가치"
      steps={[
        { icon: TrendingUp,   label: '명목임금↑',  sub: '연봉 5% 인상',   color: 'green'  },
        { icon: ShoppingCart, label: '물가상승',   sub: 'CPI 5% 상승',   color: 'red'    },
        { icon: Calculator,   label: '실질임금',   sub: '명목-물가 = 0%', color: 'yellow' },
        { icon: Scale,        label: '구매력 유지', sub: '실제론 제자리',  color: 'blue'   },
      ]}
      result="물가만큼 임금이 올라야 실질적으로 부자가 돼요"
    />
  ),

  81: () => (
    <BiteInfographic
      title="코스닥 지수 읽기"
      steps={[
        { icon: Factory,      label: '중소·벤처·기술주', sub: '코스피보다 작은 기업',  color: 'blue'   },
        { icon: ArrowUpDown,  label: '변동성 큼',        sub: '하루 변동폭이 더 커요',  color: 'yellow' },
        { icon: TrendingDown, label: '금리 인상기',      sub: '성장주라 더 크게 하락',  color: 'red'    },
        { icon: Eye,          label: '내 투자',          sub: '벤처펀드·테마 ETF 영향', color: 'yellow' },
      ]}
      result="코스닥은 코스피보다 변동성이 큰 성장주 중심 지수예요"
    />
  ),

  82: () => (
    <BiteInfographic
      title="금리가 작동하는 방식"
      steps={[
        { icon: Wallet,  label: '원금',  sub: '맡기거나 빌린 돈', color: 'green'  },
        { icon: Percent, label: '금리',  sub: '붙는 비율',       color: 'yellow' },
        { icon: Coins,   label: '이자',  sub: '주고받는 대가',    color: 'green'  },
      ]}
      result="돈을 빌리거나 맡길 때 붙는 대가"
    />
  ),

  83: () => (
    <CompositionInfographic
      title="순자산 계산 흐름"
      op="subtract"
      items={[
        { icon: Wallet,     label: '자산', sub: '가진 것 전체', color: 'green' },
        { icon: CreditCard, label: '부채', sub: '갚아야 할 빚', color: 'red'   },
      ]}
      total={{ icon: CheckCircle, label: '순자산', sub: '자산 − 부채', color: 'blue' }}
      result="자산에서 부채를 뺀, 진짜 내 재산"
    />
  ),

  84: () => (
    <BiteInfographic
      title="마이너스통장 사용 흐름"
      steps={[
        { icon: CreditCard, label: '한도 설정', sub: '미리 정한 한도',   color: 'yellow' },
        { icon: Wallet,     label: '필요할 때 인출', sub: '잔액 마이너스 가능', color: 'green' },
        { icon: Percent,    label: '쓴 만큼 이자', sub: '사용 금액만',    color: 'yellow' },
      ]}
      result="필요한 만큼만 빌려 쓰는 통장"
    />
  ),

  85: () => (
    <BiteInfographic
      title="파킹통장의 원리"
      steps={[
        { icon: Wallet,    label: '자유입출금', sub: '언제든 넣고 빼기', color: 'green'  },
        { icon: Percent,   label: '이자 지급',  sub: '하루만 맡겨도',    color: 'yellow' },
        { icon: PiggyBank, label: '파킹',      sub: '잠깐 돈을 세워둠', color: 'green'  },
      ]}
      result="자유롭게 넣고 빼면서도 이자를 받는 통장"
    />
  ),

  86: () => (
    <ComparisonInfographic
      title="같은 이자, 세금 유무의 차이"
      branches={[
        { icon: AlertCircle,  label: '일반 과세', sub: '15.4% 세금 차감', color: 'red'   },
        { icon: CheckCircle,  label: '비과세',   sub: '세금 없이 100% 수령', color: 'green' },
      ]}
      result="같은 이자라도 세금 유무로 실수령액이 달라져요"
    />
  ),

  87: () => (
    <BiteInfographic
      title="금리인하요구권 신청 흐름"
      steps={[
        { icon: TrendingUp,  label: '신용 개선', sub: '취업·소득 증가', color: 'green'  },
        { icon: AlertCircle, label: '인하 신청', sub: '은행에 요구',    color: 'yellow' },
        { icon: CheckCircle, label: '금리 인하', sub: '이자 부담 감소',  color: 'green'  },
      ]}
      result="형편이 좋아지면 대출 금리도 낮출 수 있어요"
    />
  ),

  88: () => (
    <BiteInfographic
      title="보험이 작동하는 원리"
      steps={[
        { icon: Users,       label: '가입자',     sub: '보험료 납부', color: 'green' },
        { icon: Coins,       label: '보험료 모임', sub: '큰 돈으로',   color: 'yellow' },
        { icon: AlertCircle, label: '사고 발생',  sub: '일부에게만',  color: 'red'   },
        { icon: CheckCircle, label: '보험금 지급', sub: '위험 분산',   color: 'green' },
      ]}
      result="많은 사람이 위험을 나눠 부담하는 원리"
    />
  ),

  89: () => (
    <CompositionInfographic
      title="기름값의 구성"
      items={[
        { icon: Droplet,  label: '원유·유통', sub: '원가+마진', color: 'green'  },
        { icon: Landmark, label: '유류세',   sub: '교통세 등', color: 'yellow' },
      ]}
      total={{ icon: ShoppingBasket, label: '기름값', sub: '주유소 가격', color: 'blue' }}
      result="기름값의 상당 부분은 세금이에요"
    />
  ),

  90: () => (
    <ComparisonInfographic
      title="정해지는 방식이 다른 두 금리"
      branches={[
        { icon: Landmark,  label: '기준금리',  sub: '중앙은행이 결정', color: 'yellow' },
        { icon: LineChart, label: '국채 금리', sub: '시장이 결정',    color: 'green'  },
      ]}
      result="같은 금리라도 정해지는 방식이 달라요"
    />
  ),

  91: () => (
    <BiteInfographic
      title="대출금리가 정해지는 과정"
      steps={[
        { icon: Users,   label: '신청자',   sub: '신용도·소득', color: 'green'  },
        { icon: Percent, label: '대출금리', sub: '적용 비율',   color: 'yellow' },
        { icon: Wallet,  label: '실제 이자', sub: '내가 내는 돈', color: 'red'    },
      ]}
      result="내가 실제로 부담하는 대출 이자율"
    />
  ),

  92: () => (
    <CompositionInfographic
      title="대출금리의 구성"
      items={[
        { icon: Landmark, label: '기준금리', sub: '정책 금리',    color: 'yellow' },
        { icon: Percent,  label: '가산금리', sub: '신용 위험 반영', color: 'red'    },
      ]}
      total={{ icon: Wallet, label: '대출금리', sub: '내가 내는 금리', color: 'blue' }}
      result="기준금리에 가산금리를 더한 값"
    />
  ),

  93: () => (
    <ComparisonInfographic
      title="평소 인상 폭과 빅스텝 비교"
      branches={[
        { icon: TrendingUp,    label: '베이비스텝', sub: '0.25%p 인상', color: 'yellow' },
        { icon: AlertTriangle, label: '빅스텝',    sub: '0.5%p 인상',  color: 'red'    },
      ]}
      result="평소보다 두 배 큰 폭의 금리 인상"
    />
  ),

  94: () => (
    <ComparisonInfographic
      title="저축과 투자의 차이"
      branches={[
        { icon: PiggyBank,  label: '저축', sub: '원금 보장·낮은 수익',   color: 'green'  },
        { icon: TrendingUp, label: '투자', sub: '위험 감수·높은 기대수익', color: 'yellow' },
      ]}
      result="위험을 감수하고 돈을 불리는 것이 투자예요"
    />
  ),

  95: () => (
    <ComparisonInfographic
      title="주식과 암호화폐의 변동성 비교"
      branches={[
        { icon: LineChart,     label: '주식',   sub: '상대적으로 완만한 변동', color: 'green' },
        { icon: AlertTriangle, label: '암호화폐', sub: '훨씬 큰 변동성',      color: 'red'   },
      ]}
      result="암호화폐는 가격 변동이 훨씬 커요"
    />
  ),

  96: () => (
    <CompositionInfographic
      title="ESG의 세 가지 요소"
      items={[
        { icon: Globe, label: '환경(E)',   sub: '기후·오염', color: 'green'  },
        { icon: Users, label: '사회(S)',   sub: '인권·노동', color: 'yellow' },
        { icon: Scale, label: '지배구조(G)', sub: '투명 경영', color: 'green'  },
      ]}
      total={{ icon: CheckCircle, label: 'ESG 투자', sub: '셋을 함께 평가', color: 'blue' }}
      result="재무 실적 외의 것까지 함께 보는 투자"
    />
  ),

  97: () => (
    <BiteInfographic
      title="서학개미의 수익 구조"
      steps={[
        { icon: Globe,       label: '해외 주식 매수', sub: '주로 미국',    color: 'green'  },
        { icon: ArrowUpDown, label: '환율 변동',     sub: '추가 변수',    color: 'yellow' },
        { icon: Wallet,      label: '원화 환산 수익', sub: '주가+환율 결합', color: 'green'  },
      ]}
      result="주가와 환율, 두 가지를 함께 봐야 해요"
    />
  ),

  98: () => (
    <BiteInfographic
      title="관세가 붙는 과정"
      steps={[
        { icon: Ship,    label: '수입품',   sub: '해외에서 들여옴',   color: 'green'  },
        { icon: Percent, label: '관세 부과', sub: '세금 추가',        color: 'yellow' },
        { icon: Home,    label: '국내 산업', sub: '가격 경쟁력 보호', color: 'green'  },
      ]}
      result="수입품에 매기는 세금, 국내 산업 보호 수단"
    />
  ),

  99: () => (
    <BiteInfographic
      title="공급망의 흐름"
      steps={[
        { icon: Factory,       label: '원자재·부품', sub: '여러 나라에서', color: 'green'  },
        { icon: Truck,         label: '운송·조립',  sub: '여러 단계',    color: 'yellow' },
        { icon: ShoppingCart,  label: '소비자',     sub: '완제품 도착',   color: 'green'  },
      ]}
      result="한 단계만 막혀도 전체가 멈출 수 있어요"
    />
  ),

  100: () => (
    <CompositionInfographic
      title="상황마다 다른 세금"
      items={[
        { icon: Wallet,       label: '소득세',    sub: '번 돈에',   color: 'green'  },
        { icon: ShoppingCart, label: '부가가치세', sub: '소비할 때', color: 'yellow' },
        { icon: LineChart,    label: '거래세',    sub: '거래할 때', color: 'green'  },
      ]}
      total={{ icon: Landmark, label: '세금', sub: '상황별로 다름', color: 'blue' }}
      result="버는 것·쓰는 것·거래하는 것마다 다른 세금이 붙어요"
    />
  ),

  101: () => (
    <ComparisonInfographic
      title="시점이 다른 두 세금"
      branches={[
        { icon: Users,  label: '상속',  sub: '사망 후 물려받음', color: 'yellow' },
        { icon: Wallet, label: '증여',  sub: '생전에 미리 받음', color: 'green'  },
      ]}
      result="시점만 다를 뿐 재산 이전에 붙는 세금"
    />
  ),

  102: () => (
    <BiteInfographic
      title="거래세가 붙는 과정"
      steps={[
        { icon: LineChart, label: '자산 매도', sub: '주식·부동산 등', color: 'green'  },
        { icon: Percent,   label: '거래세',   sub: '거래할 때 부과', color: 'yellow' },
        { icon: Wallet,    label: '실수령액', sub: '거래세만큼 감소', color: 'red'    },
      ]}
      result="사고팔 때마다 붙는 세금"
    />
  ),

  103: () => (
    <BiteInfographic
      title="IRP 계좌의 역할"
      steps={[
        { icon: Briefcase, label: '이직·퇴직', sub: '퇴직금 발생',     color: 'yellow' },
        { icon: Wallet,    label: 'IRP 계좌',  sub: '개인이 직접 개설', color: 'green'  },
        { icon: PiggyBank, label: '노후자금',  sub: '하나로 모아 운용', color: 'green'  },
      ]}
      result="이직해도 유지되는 내 퇴직연금 계좌"
    />
  ),

  104: () => (
    <CompositionInfographic
      title="자산관리를 이루는 것들"
      items={[
        { icon: PiggyBank,  label: '저축',    sub: '안전하게 모으기', color: 'green'  },
        { icon: TrendingUp, label: '투자',    sub: '위험 감수 성장',  color: 'yellow' },
        { icon: Calculator, label: '세금 관리', sub: '혜택 챙기기',    color: 'green'  },
      ]}
      total={{ icon: CheckCircle, label: '자산관리', sub: '전체를 운용', color: 'blue' }}
      result="배운 것들을 실제 삶에 연결하는 것"
    />
  ),

  105: () => (
    <ComparisonInfographic
      title="경쟁 시장과 독점 시장"
      branches={[
        { icon: Users,         label: '경쟁 시장', sub: '여러 기업, 소비자 선택권', color: 'green' },
        { icon: AlertTriangle, label: '독점 시장', sub: '소수 기업, 가격 결정력',  color: 'red'   },
      ]}
      result="경쟁이 없으면 소비자의 협상력이 약해져요"
    />
  ),

  106: () => (
    <CompositionInfographic
      title="집을 갖거나 빌리는 방법"
      items={[
        { icon: Home,       label: '매매', sub: '직접 소유',    color: 'green'  },
        { icon: Wallet,     label: '전세', sub: '보증금+무이자', color: 'yellow' },
        { icon: CreditCard, label: '월세', sub: '매달 지출',    color: 'green'  },
      ]}
      total={{ icon: Building2, label: '부동산', sub: '사고팔고 빌리는 시장', color: 'blue' }}
      result="집을 갖거나 빌리는 여러 방법"
    />
  ),

  107: () => (
    <BiteInfographic
      title="대출 규제가 작동하는 이유"
      steps={[
        { icon: AlertTriangle, label: '집값·부채 우려', sub: '과열 신호',    color: 'red'    },
        { icon: Scale,         label: '대출 규제',    sub: 'LTV·DSR 한도', color: 'yellow' },
        { icon: Home,          label: '대출 가능액',  sub: '한도 안에서만', color: 'green'  },
      ]}
      result="집값·가계빚 과열을 막기 위한 정책 수단"
    />
  ),

  108: () => (
    <ComparisonInfographic
      title="개인의 빚과 나라의 빚"
      branches={[
        { icon: Wallet, label: '개인의 부채', sub: '내가 진 빚 (1장)',      color: 'green'  },
        { icon: Globe,  label: '가계부채',   sub: '나라 전체 가계 빚 총량', color: 'yellow' },
      ]}
      result="같은 '빚'이지만 보는 범위가 달라요"
    />
  ),

  109: () => (
    <CompositionInfographic
      title="집값이 마련되는 방식"
      items={[
        { icon: Landmark, label: '대출금',  sub: 'LTV 한도까지', color: 'yellow' },
        { icon: Wallet,   label: '자기자본', sub: '내가 마련',    color: 'green'  },
      ]}
      total={{ icon: Home, label: '집값', sub: '전체 매매가', color: 'blue' }}
      result="대출과 내 돈을 합쳐 집값을 마련해요"
    />
  ),

  110: () => (
    <CompositionInfographic
      title="보유세의 구성"
      items={[
        { icon: Home,      label: '재산세',    sub: '모든 소유자',    color: 'green'  },
        { icon: Building2, label: '종합부동산세', sub: '고가·다주택 추가', color: 'yellow' },
      ]}
      total={{ icon: Landmark, label: '보유세', sub: '매년 납부', color: 'blue' }}
      result="부동산을 갖고 있는 동안 매년 내는 세금"
    />
  ),

  111: () => (
    <ComparisonInfographic
      title="보유할 때와 팔 때의 세금"
      branches={[
        { icon: Clock,     label: '보유세',   sub: '갖고 있는 동안 매년', color: 'yellow' },
        { icon: RefreshCw, label: '양도소득세', sub: '팔 때 차익에 한 번', color: 'green'  },
      ]}
      result="보유 중이냐 판 순간이냐로 붙는 세금이 달라요"
    />
  ),

  112: () => (
    <BiteInfographic
      title="재개발·재건축의 흐름"
      steps={[
        { icon: Home,       label: '낡은 건물',    sub: '노후 주택',    color: 'red'    },
        { icon: RefreshCw,  label: '재건축·재개발', sub: '허물고 다시 짓기', color: 'yellow' },
        { icon: Building2,  label: '새 아파트',    sub: '가치 상승 기대', color: 'green'  },
      ]}
      result="낡은 집이 새 아파트로 바뀌는 과정"
    />
  ),

  113: () => (
    <BiteInfographic
      title="신용거래융자의 구조"
      steps={[
        { icon: Wallet,   label: '내 돈',     sub: '100만원',      color: 'green'  },
        { icon: Banknote, label: '증권사 융자', sub: '100만원 추가', color: 'yellow' },
        { icon: TrendingUp, label: '매수 규모', sub: '200만원',     color: 'yellow' },
        { icon: Scale,    label: '손익',       sub: '두 배로 확대', color: 'red'    },
      ]}
      result="레버리지만큼 수익도 손실도 커져요"
    />
  ),

  114: () => (
    <CompositionInfographic
      title="순이자마진(NIM)의 구조"
      op="subtract"
      items={[
        { icon: TrendingUp, label: '대출금리', sub: '평균 6%', color: 'red'   },
        { icon: PiggyBank,  label: '예금금리', sub: '평균 2%', color: 'green' },
      ]}
      total={{ icon: Percent, label: 'NIM', sub: '예대마진 4%p', color: 'blue' }}
      result="이 차이가 은행의 핵심 수익이 돼요"
    />
  ),

  115: () => (
    <BiteInfographic
      title="대환대출의 흐름"
      steps={[
        { icon: TrendingUp,   label: '기존 대출', sub: '금리 7%',    color: 'red'    },
        { icon: RefreshCw,    label: '갈아타기',  sub: '대환대출 신청', color: 'yellow' },
        { icon: TrendingDown, label: '새 대출',   sub: '금리 5%',    color: 'green'  },
      ]}
      result="같은 빚을 더 낮은 이자로 바꾸는 것"
    />
  ),

  116: () => (
    <ComparisonInfographic
      title="고정금리 vs 변동금리"
      branches={[
        { icon: Scale,      label: '고정금리', sub: '만기까지 동일',     color: 'green'  },
        { icon: ArrowUpDown, label: '변동금리', sub: '시장 금리 따라 변동', color: 'yellow' },
      ]}
      result="금리 방향에 따라 유불리가 갈려요"
    />
  ),

  117: () => (
    <BiteInfographic
      title="채무조정(개인워크아웃)의 흐름"
      steps={[
        { icon: AlertTriangle, label: '여러 빚',   sub: '상환 어려움',   color: 'red'    },
        { icon: Scale,         label: '채무조정 신청', sub: '신용회복위원회', color: 'yellow' },
        { icon: RefreshCw,     label: '상환계획 조정', sub: '기간 연장'    , color: 'yellow' },
        { icon: CheckCircle,   label: '상환 부담 감소', sub: '신용 회복'    , color: 'green'  },
      ]}
      result="갚을 수 있는 계획으로 다시 짜는 것"
    />
  ),

  118: () => (
    <ComparisonInfographic
      title="카드론 vs 현금서비스"
      branches={[
        { icon: Clock,      label: '현금서비스', sub: '단기·소액', color: 'yellow' },
        { icon: CreditCard, label: '카드론',    sub: '장기 분할',  color: 'yellow' },
      ]}
      result="둘 다 급할 때 쓰는 고금리 대출이에요"
    />
  ),

  119: () => (
    <BiteInfographic
      title="중도상환수수료가 발생하는 순간"
      steps={[
        { icon: Banknote, label: '대출 실행',   sub: '만기까지 계획',  color: 'green'  },
        { icon: Zap,      label: '조기 상환',   sub: '만기 전 완납',   color: 'yellow' },
        { icon: Percent,  label: '수수료 발생', sub: '대출금의 1~2%', color: 'red'    },
      ]}
      result="일찍 갚아도 수수료는 따로 붙어요"
    />
  ),

  120: () => (
    <BiteInfographic
      title="보이스피싱이 진행되는 방식"
      steps={[
        { icon: Phone,         label: '기관 사칭 전화', sub: '검찰·은행 등', color: 'red' },
        { icon: AlertTriangle, label: '겁주기',        sub: '다급한 상황 연출', color: 'red' },
        { icon: Wallet,        label: '송금·정보 유출', sub: '피해 발생',   color: 'red' },
      ]}
      result="전화로 돈·개인정보를 요구하면 100% 사기"
    />
  ),

  121: () => (
    <BiteInfographic
      title="스미싱이 진행되는 방식"
      steps={[
        { icon: MessageSquare, label: '문자 속 링크', sub: '택배·청첩장 위장', color: 'red' },
        { icon: Link2,         label: '링크 클릭',   sub: '무심코 접속',    color: 'yellow' },
        { icon: Smartphone,    label: '악성 앱 설치', sub: '자동 실행',     color: 'red' },
        { icon: Eye,           label: '정보 유출',   sub: '금융정보 탈취',  color: 'red' },
      ]}
      result="모르는 링크는 누르지 않는 게 최선"
    />
  ),

  122: () => (
    <BiteInfographic
      title="리딩방 투자사기가 진행되는 방식"
      steps={[
        { icon: Users,       label: '무료 정보방', sub: '카톡·텔레그램', color: 'yellow' },
        { icon: CheckCircle, label: '신뢰 형성',   sub: '가짜 수익 인증', color: 'yellow' },
        { icon: Smartphone,  label: '앱·계좌 유도', sub: '제도권 밖 송금', color: 'red'    },
        { icon: UserX,       label: '잠적',       sub: '연락 두절',     color: 'red'    },
      ]}
      result="제도권 밖으로의 송금 유도는 사기 신호"
    />
  ),

  123: () => (
    <BiteInfographic
      title="불법사금융 피해가 커지는 과정"
      steps={[
        { icon: ShieldAlert,   label: '미등록 업체', sub: '금융당국 미인가', color: 'red' },
        { icon: Percent,       label: '고금리 대출', sub: '법정 최고금리 초과', color: 'red' },
        { icon: AlertTriangle, label: '상환 불능',   sub: '이자 눈덩이',    color: 'red' },
        { icon: Bell,          label: '불법 추심',   sub: '협박성 독촉',    color: 'red' },
      ]}
      result="등록 대부업체인지 먼저 확인하세요"
    />
  ),

  124: () => (
    <BiteInfographic
      title="전세사기가 벌어지는 방식"
      steps={[
        { icon: KeyRound, label: '이중계약·근저당 은폐', sub: '계약 전 속임수', color: 'red'    },
        { icon: Home,     label: '전세 계약',          sub: '보증금 지급',    color: 'yellow' },
        { icon: Wallet,   label: '보증금 미반환',       sub: '피해 발생',     color: 'red'    },
      ]}
      result="등기부등본 확인이 첫 번째 예방책"
    />
  ),

  125: () => (
    <BiteInfographic
      title="로맨스스캠이 진행되는 방식"
      steps={[
        { icon: Heart,       label: '온라인 친분', sub: 'SNS·소개팅 앱', color: 'yellow' },
        { icon: CheckCircle, label: '신뢰 형성',   sub: '장기간 대화',   color: 'yellow' },
        { icon: TrendingUp,  label: '투자 유도',   sub: '해외 투자 앱',  color: 'red'    },
        { icon: UserX,       label: '잠적',       sub: '연락 두절',    color: 'red'    },
      ]}
      result="만난 적 없는 사람의 투자 권유는 거절"
    />
  ),

  126: () => (
    <BiteInfographic
      title="유사수신이 무너지는 구조"
      steps={[
        { icon: ShieldAlert,   label: '미인가 업체', sub: '금융당국 인가 없음', color: 'red' },
        { icon: Percent,       label: '원금보장·고수익 약속', sub: '비정상적 조건', color: 'red' },
        { icon: Users,         label: '자금 모집',   sub: '투자자 확대',    color: 'yellow' },
        { icon: AlertTriangle, label: '돌려막기 붕괴', sub: '결국 파산',    color: 'red'    },
      ]}
      result="원금 보장 + 고수익은 동시에 불가능한 약속"
    />
  ),

  127: () => (
    <BiteInfographic
      title="중고거래 사기가 벌어지는 방식"
      steps={[
        { icon: ShoppingCart, label: '시세보다 싼 매물', sub: '관심 유도',   color: 'yellow' },
        { icon: Banknote,     label: '선입금 요구',    sub: '직거래 거부',  color: 'yellow' },
        { icon: UserX,        label: '잠적·미배송',    sub: '연락 두절',   color: 'red'    },
      ]}
      result="안전결제로 확인한 뒤 거래하세요"
    />
  ),

  128: () => (
    <BiteInfographic
      title="대포통장이 만들어지는 과정"
      steps={[
        { icon: Banknote,   label: '통장 양도 제안', sub: '대가 지급 약속', color: 'yellow' },
        { icon: CreditCard, label: '통장 넘김',     sub: '본인 명의 계좌', color: 'red'    },
        { icon: AlertCircle, label: '사기자금 인출', sub: '범죄에 이용',   color: 'red'    },
        { icon: Scale,      label: '명의자 처벌',    sub: '몰랐어도 책임', color: 'red'    },
      ]}
      result="몰랐어도 통장 양도는 처벌 대상이 돼요"
    />
  ),
}
