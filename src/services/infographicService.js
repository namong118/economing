import { callSolar } from './solarService';
import { getInfographic, AI_INFOGRAPHIC_KEYWORDS } from '../data/infographicData';
import { AVAILABLE_ICON_NAMES } from '../components/infographic/InfographicIcon';

const _cache = {};

const SYSTEM_PROMPT = `당신은 경제 개념을 시각화하는 인포그래픽 전문가입니다.
사용자의 경제 질문에 맞는 인포그래픽 JSON을 생성하세요.

타입 선택 기준:
- flow: 순서나 과정이 있는 개념 (예: 복리 작동 원리, 대출 받는 순서)
- collection: 여러 요소가 모여 하나를 이루는 개념 (예: 포트폴리오 구성, ISA 계좌 안에 담을 수 있는 것)
- compare: 두 가지를 비교하는 개념 (예: 주식 vs ETF, 전세 vs 월세, 단리 vs 복리)

사용 가능한 아이콘 이름 (반드시 이 목록에서만 선택):
${AVAILABLE_ICON_NAMES}

JSON 스키마 (타입에 맞게 하나만 반환):
flow: {"type":"flow","title":"제목(15자이내)","steps":[{"icon":"아이콘명","label":"라벨(8자이내)","note":"부연(선택,18자이내)"}]}
collection: {"type":"collection","title":"제목(15자이내)","items":[{"icon":"아이콘명","label":"라벨(7자이내)"}],"result":{"icon":"아이콘명","label":"결과라벨(10자이내)","note":"부연(선택,18자이내)"}}
compare: {"type":"compare","title":"제목(15자이내)","left":{"icon":"아이콘명","label":"라벨(7자이내)","color":"#3B82F6","points":["특징(14자이내)","특징","특징"]},"right":{"icon":"아이콘명","label":"라벨(7자이내)","color":"#21C58E","points":["특징","특징","특징"]},"note":"한줄요약(선택,24자이내)"}

규칙:
- steps는 3~5개, items는 3~4개, points는 각 2~4개
- 순수 JSON만 반환 (코드블록, 설명 없이)`;

function hasConceptKeyword(question) {
  const q = question.toLowerCase();
  return AI_INFOGRAPHIC_KEYWORDS.some(k => q.includes(k.toLowerCase()));
}

function validate(data) {
  if (!data || !['flow', 'collection', 'compare'].includes(data.type)) return false;
  if (data.type === 'flow')       return Array.isArray(data.steps) && data.steps.length >= 2;
  if (data.type === 'collection') return Array.isArray(data.items) && data.items.length >= 2 && data.result;
  if (data.type === 'compare')    return data.left && data.right;
  return false;
}

export async function getOrGenerateInfographic(question) {
  // 1. 정적 데이터 우선
  const staticResult = getInfographic(question);
  if (staticResult) return staticResult;

  // 2. 개념 키워드 없으면 스킵
  if (!hasConceptKeyword(question)) return null;

  // 3. 캐시 확인
  const cacheKey = question.trim().slice(0, 100);
  if (_cache[cacheKey] !== undefined) return _cache[cacheKey];

  // 4. Solar AI 생성
  try {
    const content = await callSolar({
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `다음 경제 질문에 맞는 인포그래픽을 만들어주세요:\n"${question}"` }],
    });

    const clean  = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);

    const result = validate(parsed) ? parsed : null;
    _cache[cacheKey] = result;
    return result;
  } catch {
    _cache[cacheKey] = null;
    return null;
  }
}
