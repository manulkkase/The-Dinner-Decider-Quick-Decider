// shared/recEngine.ts

import { MenuItem } from './types';
import { getRecentMenus, getDislikedMenus } from './storage';
import { pickRandom } from './utils';

// menuData.json을 직접 import하여 사용합니다.
import allItems from './menuData.json';

/**
 * 다음 추천 메뉴를 결정하는 핵심 함수입니다.
 * @returns 추천 메뉴 아이템 객체 또는 null
 */
export const getNextSuggestion = async (): Promise<MenuItem | null> => {
  // menuData.json 파일이 비어있으면 null을 반환합니다.
  if (!allItems || allItems.length === 0) {
    console.error("Menu data is empty or not loaded.");
    return null;
  }

  // 1. 저장소에서 '최근 본 메뉴'와 '싫어요 누른 메뉴' 목록을 가져옵니다.
  const [recentIds, dislikedIds] = await Promise.all([
    getRecentMenus(),
    getDislikedMenus(),
  ]);
  
  // 2. 두 목록을 합쳐 '제외할 ID 목록'을 만듭니다.
  const excludedIds = new Set([...recentIds, ...dislikedIds]);

  // 3. 전체 메뉴에서 '제외할 ID'들을 걸러내어 후보 목록을 만듭니다.
  let candidateItems = allItems.filter(item => !excludedIds.has(item.id));

  // 4. 만약 모든 메뉴를 다 보거나 싫어해서 후보가 없다면?
  // '싫어요'는 유지하되, '최근 본 메뉴'는 다시 추천 대상에 포함시킵니다.
  if (candidateItems.length === 0) {
    const dislikedIdSet = new Set(dislikedIds);
    candidateItems = allItems.filter(item => !dislikedIdSet.has(item.id));
  }
  
  // 5. 그래도 후보가 없다면 (모든 메뉴를 '싫어요' 한 경우),
  // 어쩔 수 없이 전체 목록에서 다시 추천합니다.
  if (candidateItems.length === 0) {
    candidateItems = allItems;
  }
  
  // 6. 최종 후보 목록에서 무작위로 하나를 선택하여 반환합니다.
  return pickRandom(candidateItems) || null;
};