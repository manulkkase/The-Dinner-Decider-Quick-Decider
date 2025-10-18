// shared/storage.ts

import { RECENT_WINDOW_SIZE } from './config';

// 'chrome' 객체가 없을 수도 있는 환경을 위해 선언합니다.
declare const chrome: any;

// 저장소에서 사용할 고유 키들을 정의합니다.
const RECENT_MENUS_KEY = 'dinnerDeciderRecent';
const DISLIKED_MENUS_KEY = 'dinnerDeciderDisliked';
const SESSION_ID_KEY = 'tdd_session_id';

// 크롬 익스텐션 환경에서는 chrome.storage.local을 사용하고,
// 일반 웹(localhost) 환경에서는 localStorage를 사용하도록 하는 똑똑한 storage 객체입니다.
const storage = {
  get: (key: string): Promise<any> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result: any) => {
          resolve(result[key]);
        });
      });
    } else {
      const item = localStorage.getItem(key);
      return Promise.resolve(item ? JSON.parse(item) : undefined);
    }
  },
  set: (key: string, value: any): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
  },
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

// --- 아래 함수들을 수정합니다 ---

export const getRecentMenus = async (): Promise<number[]> => {
  const recent = await storage.get(RECENT_MENUS_KEY);
  return Array.isArray(recent) ? recent : [];
};

export const addRecentMenu = async (menuId: number): Promise<void> => {
  const currentHistory = await getRecentMenus();
  // id가 숫자로 저장되도록 통일합니다.
  const newHistory = [menuId, ...currentHistory.filter(id => id !== menuId)].slice(0, RECENT_WINDOW_SIZE);
  await storage.set(RECENT_MENUS_KEY, newHistory);
};

export const getDislikedMenus = async (): Promise<number[]> => {
  const disliked = await storage.get(DISLIKED_MENUS_KEY);
  return Array.isArray(disliked) ? disliked : [];
};

export const addDislikedMenu = async (menuId: number): Promise<void> => {
  const currentDisliked = await getDislikedMenus();
  if (!currentDisliked.includes(menuId)) {
    const newDisliked = [...currentDisliked, menuId];
    await storage.set(DISLIKED_MENUS_KEY, newDisliked);
  }
};