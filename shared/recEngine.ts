import { MenuItem } from './types';
import { getRecentMenus, getDislikedMenus } from './storage';
import { pickRandom } from './utils';

let allItems: MenuItem[] | null = null;

/**
 * Fetches and caches the menu data from the JSON file.
 * This function ensures the data is only loaded from the network once.
 * @returns A promise that resolves to the array of menu items.
 */
async function loadMenuData(): Promise<MenuItem[]> {
  if (allItems) {
    return allItems;
  }

  try {
    // The path should be relative to the root of the extension
    const response = await fetch('/shared/menuData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allItems = data as MenuItem[];
    return allItems;
  } catch (error) {
    console.error("Failed to load menu data:", error);
    // Return an empty array to prevent the app from crashing
    return [];
  }
}

export const getNextSuggestion = async (): Promise<MenuItem | null> => {
  const menuItems = await loadMenuData();
  
  if (menuItems.length === 0) {
    return null;
  }

  const [recentIds, dislikedIds] = await Promise.all([
    getRecentMenus(),
    getDislikedMenus()
  ]);
  
  const excludedIds = new Set([...recentIds, ...dislikedIds]);

  let candidateItems = menuItems.filter(item => !excludedIds.has(item.id.toString()));

  // If filtering leaves no options (e.g., user has seen or disliked all items),
  // fall back to a less strict filter.
  if (candidateItems.length === 0) {
    const recentIdSet = new Set(recentIds);
    candidateItems = menuItems.filter(item => !recentIdSet.has(item.id.toString()));
     // If that still fails (e.g., all available items are in the recent list),
     // use the full list as a last resort to always provide a suggestion.
    if (candidateItems.length === 0) {
        candidateItems = menuItems;
    }
  }
  
  return pickRandom(candidateItems) || null;
};