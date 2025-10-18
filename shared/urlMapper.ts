import { MenuItem } from './types';
import { WEBSITE_BASE_URL, SEARCH_PATH, UTM_PARAMS } from './config';

// The slug is no longer in the data, so we create it from the name.
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
};


export const buildPrimaryUrl = (item: MenuItem, sessionId: string): string => {
  // 1. slug와 URL 경로를 /result/음식이름 으로 만듭니다.
  const slug = createSlug(item.name);
  const encodedFoodName = encodeURIComponent(item.name);
  const path = `${SEARCH_PATH}/${encodedFoodName}`;
  const baseUrl = `${WEBSITE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', UTM_PARAMS.source);
  url.searchParams.set('utm_medium', UTM_PARAMS.medium);
  url.searchParams.set('utm_campaign', UTM_PARAMS.campaign);
  url.searchParams.set('utm_content', slug || 'unknown');
  url.searchParams.set('ses', sessionId);

  return url.toString();
};
