import { regions, gdpAnnual } from '../data';
import type { Region } from '../types/region';
import type { GDPData } from '../types/gdp';

export interface SimilarRegion {
  region: Region;
  gdpData: GDPData;
  diffValue: number;      // GDP差值（亿元）
  diffPercent: number;    // 差值百分比
}

export interface FindSimilarOptions {
  limit?: number;         // 返回数量，默认10
  sameLevelOnly?: boolean; // 只匹配同级，默认true
  year?: number;          // 年份，默认2025
}

/**
 * 查找与目标区域GDP相近的其他省份区域
 * @param targetCode - 目标区域行政区划代码
 * @param options - 配置选项
 * @returns 相似区域列表，按GDP差值从小到大排序
 */
export function findSimilarRegions(
  targetCode: string,
  options: FindSimilarOptions = {}
): SimilarRegion[] {
  const {
    limit = 10,
    sameLevelOnly = true,
    year = 2025,
  } = options;

  // 1. 获取目标区域信息
  const targetRegion = regions.find(r => r.code === targetCode);
  if (!targetRegion) {
    return [];
  }

  // 2. 获取目标区域的GDP数据
  const targetGDP = gdpAnnual.find(
    gdp => gdp.regionCode === targetCode && gdp.year === year && gdp.granularity === 'year'
  );
  if (!targetGDP) {
    return [];
  }

  // 3. 筛选候选区域
  const candidates = regions.filter(candidate => {
    // 排除目标区域自身
    if (candidate.code === targetCode) {
      return false;
    }

    // 排除同省份的区域（省外）
    if (candidate.provinceCode === targetRegion.provinceCode) {
      return false;
    }

    // 只匹配同级（市比市、区比区）
    if (sameLevelOnly && candidate.level !== targetRegion.level) {
      return false;
    }

    return true;
  });

  // 4. 获取候选区域的GDP数据并计算差值
  const results: SimilarRegion[] = [];
  
  for (const candidate of candidates) {
    const candidateGDP = gdpAnnual.find(
      gdp => gdp.regionCode === candidate.code && gdp.year === year && gdp.granularity === 'year'
    );
    
    if (candidateGDP) {
      const diffValue = Math.abs(candidateGDP.value - targetGDP.value);
      const diffPercent = (diffValue / targetGDP.value) * 100;
      
      results.push({
        region: candidate,
        gdpData: candidateGDP,
        diffValue,
        diffPercent,
      });
    }
  }

  // 5. 按GDP差值从小到大排序
  results.sort((a, b) => a.diffValue - b.diffValue);

  // 6. 返回前N个结果
  return results.slice(0, limit);
}

/**
 * 获取差值的颜色类名
 * @param diffPercent - 差值百分比
 * @returns Tailwind颜色类名
 */
export function getDiffColorClass(diffPercent: number): string {
  if (diffPercent < 10) {
    return 'text-green-600 bg-green-50 border-green-200';
  } else if (diffPercent < 30) {
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  } else {
    return 'text-red-600 bg-red-50 border-red-200';
  }
}

/**
 * 获取差值的标签文字
 * @param diffPercent - 差值百分比
 * @returns 标签文字
 */
export function getDiffLabel(diffPercent: number): string {
  if (diffPercent < 10) {
    return '高度相似';
  } else if (diffPercent < 30) {
    return '较为相似';
  } else {
    return '差异较大';
  }
}
