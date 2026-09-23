export type CardLayoutType =
  | 'list-item'
  | 'three-column'
  | 'two-column'
  | 'media'
  | 'stats'
  | 'timeline'
  | 'calendar'
  | 'profile'
  | 'table'
  | 'form';

type QueryCategory = 'list' | 'schedule' | 'stats' | 'people' | 'data' | 'form' | 'general';

const categoryLayouts: Record<QueryCategory, CardLayoutType[]> = {
  list:     ['list-item', 'timeline', 'table'],
  schedule: ['calendar', 'timeline', 'list-item'],
  stats:    ['stats', 'three-column', 'two-column'],
  people:   ['profile', 'timeline', 'media'],
  data:     ['table', 'two-column', 'stats'],
  form:     ['form', 'two-column'],
  general:  ['list-item', 'two-column', 'media'],
};

const categoryKeywords: Record<QueryCategory, string[]> = {
  list:     ['list', 'show', 'display', 'view', 'find', 'search', 'all'],
  schedule: ['calendar', 'schedule', 'appointment', 'meeting', 'today', 'tomorrow', 'week', 'upcoming', 'next'],
  stats:    ['stats', 'statistics', 'summary', 'report', 'overview', 'dashboard', 'metrics', 'count', 'total'],
  people:   ['person', 'people', 'team', 'profile', 'contact', 'who', 'member'],
  data:     ['data', 'records', 'history', 'results', 'test', 'chart'],
  form:     ['form', 'create', 'new', 'add', 'register', 'submit', 'update'],
  general:  [],
};

function categorizeQuery(query: string): QueryCategory {
  const lower = query.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) return category as QueryCategory;
  }
  return 'general';
}

export function getRandomCardLayout(query: string): CardLayoutType {
  const layouts = categoryLayouts[categorizeQuery(query)];
  return layouts[Math.floor(Math.random() * layouts.length)];
}

export function getMultipleRandomLayouts(query: string, count: number): CardLayoutType[] {
  const layouts = categoryLayouts[categorizeQuery(query)];
  return Array.from({ length: count }, () => layouts[Math.floor(Math.random() * layouts.length)]);
}

export function getRecommendedCardCount(query: string): number {
  const multiKeywords = ['all', 'list', 'show', 'multiple', 'several'];
  return multiKeywords.some((kw) => query.toLowerCase().includes(kw))
    ? Math.floor(Math.random() * 3) + 2
    : 1;
}
