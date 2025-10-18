import { RECENT_WINDOW_SIZE } from './config';

// Fix for "Cannot find name 'chrome'" error by declaring the global chrome object.
declare const chrome: any;

const RECENT_MENUS_KEY = 'dinnerDeciderRecent';
const DISLIKED_MENUS_KEY = 'dinnerDeciderDisliked';

// Use chrome.storage.local for persistence across browser sessions.
// Fallback to localStorage for development environments where the chrome API isn't available.
const storage = (chrome && chrome.storage && chrome.storage.local) ? chrome.storage.local : {
  get: (keys: string | string[] | { [key: string]: any } | null, callback: (items: { [key: string]: any; }) => void): void => {
    if (typeof keys === 'string') {
        const item = localStorage.getItem(keys);
        callback({ [keys]: item ? JSON.parse(item) : [] });
    }
  },
  set: (items: { [key: string]: any; }, callback?: (() => void) | undefined): void => {
    for (const key in items) {
        localStorage.setItem(key, JSON.stringify(items[key]));
    }
    if (callback) callback();
  }
};


export const getRecentMenus = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    storage.get(RECENT_MENUS_KEY, (result) => {
      resolve(result[RECENT_MENUS_KEY] || []);
    });
  });
};

export const addRecentMenu = async (menuId: string): Promise<void> => {
  const currentHistory = await getRecentMenus();
  const newHistory = [menuId, ...currentHistory].slice(0, RECENT_WINDOW_SIZE);
  return new Promise((resolve) => {
    storage.set({ [RECENT_MENUS_KEY]: newHistory }, resolve);
  });
};

export const getDislikedMenus = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        storage.get(DISLIKED_MENUS_KEY, (result) => {
            resolve(result[DISLIKED_MENUS_KEY] || []);
        });
    });
};

export const addDislikedMenu = async (menuId: string): Promise<void> => {
    const currentDisliked = await getDislikedMenus();
    if (currentDisliked.includes(menuId)) {
        return Promise.resolve(); // Already disliked, do nothing.
    }
    const newDisliked = [...currentDisliked, menuId];
    return new Promise((resolve) => {
        storage.set({ [DISLIKED_MENUS_KEY]: newDisliked }, resolve);
    });
};