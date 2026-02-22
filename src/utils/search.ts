import type { Region } from '../types/region';
import { regions } from '../data';

export interface SearchResult {
  region: Region;
  matchScore: number;
  matchedText?: string;
}

/**
 * 搜索区域，支持模糊匹配
 * 按优先级排序：1.精确匹配code 2.名称前缀匹配 3.名称包含匹配 4.路径匹配
 * @param query 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 搜索结果列表
 */
export function searchRegions(query: string, limit?: number): SearchResult[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.trim();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const results: SearchResult[] = [];

  for (const region of regions) {
    let matchScore = 0;
    let matchedText: string | undefined;

    // 1. 精确匹配 code（最高分）
    if (region.code === searchTerm) {
      matchScore = 100;
      matchedText = region.name;
    }
    // 2. code 前缀匹配
    else if (region.code.startsWith(searchTerm)) {
      matchScore = 90;
      matchedText = region.name;
    }
    // 3. 名称精确匹配
    else if (region.name === searchTerm) {
      matchScore = 85;
      matchedText = region.name;
    }
    // 4. 名称前缀匹配（如"深圳"匹配"深圳市"）
    else if (region.name.startsWith(searchTerm)) {
      matchScore = 80;
      matchedText = region.name;
    }
    // 5. 名称包含匹配
    else if (region.name.toLowerCase().includes(lowerSearchTerm)) {
      matchScore = 60;
      matchedText = region.name;
    }
    // 6. 路径包含匹配
    else if (region.path.toLowerCase().includes(lowerSearchTerm)) {
      matchScore = 40;
      matchedText = region.path;
    }

    if (matchScore > 0) {
      results.push({
        region,
        matchScore,
        matchedText,
      });
    }
  }

  // 按匹配分数降序排序
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // 分数相同时，按名称长度升序（更短的优先）
    return a.region.name.length - b.region.name.length;
  });

  // 应用限制
  if (limit && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
}

/**
 * 高亮匹配文本
 * @param text 原始文本
 * @param query 搜索关键词
 * @returns 包含高亮标记的文本片段
 */
export function highlightMatch(text: string, query: string): { parts: Array<{ text: string; isMatch: boolean }> } {
  if (!query || !text) {
    return { parts: [{ text: text || '', isMatch: false }] };
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const parts: Array<{ text: string; isMatch: boolean }> = [];
  
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    // 添加匹配前的文本
    if (index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, index),
        isMatch: false,
      });
    }
    // 添加匹配的文本
    parts.push({
      text: text.slice(index, index + lowerQuery.length),
      isMatch: true,
    });
    lastIndex = index + lowerQuery.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isMatch: false,
    });
  }

  return { parts };
}

/**
 * 获取区域层级标签
 * @param level 区域层级
 * @returns 层级中文标签
 */
export function getLevelLabel(level: string): string {
  const levelMap: Record<string, string> = {
    province: '省',
    city: '地级市',
    district: '市辖区',
    county_city: '县级市',
  };
  return levelMap[level] || level;
}

/**
 * 获取热门城市列表
 * @returns 热门城市列表
 */
export function getHotCities(): Region[] {
  const hotCityCodes = [
    '110000', // 北京市
    '310000', // 上海市
    '440300', // 深圳市
    '440100', // 广州市
    '330100', // 杭州市
    '320500', // 苏州市
    '420100', // 武汉市
    '510100', // 成都市
  ];
  
  return hotCityCodes
    .map(code => regions.find(r => r.code === code))
    .filter((r): r is Region => r !== undefined);
}
