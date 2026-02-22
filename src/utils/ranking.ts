import { regions, gdpAnnual } from '../data';
import type { RegionLevel } from '../types/region';
import type { RankingItem } from '../types/comparison';
import { getRegionByCode } from './dataLoader';

const CURRENT_YEAR = 2023;

/**
 * 获取省内同级排名
 * @param targetCode - 目标区域代码
 * @returns 排名列表
 */
export function getProvinceRanking(targetCode: string): RankingItem[] {
  const targetRegion = getRegionByCode(targetCode);
  
  if (!targetRegion) {
    return [];
  }

  // 获取同省份、同级的所有区域
  const sameLevelRegions = regions.filter(
    region => 
      region.provinceCode === targetRegion.provinceCode && 
      region.level === targetRegion.level &&
      region.code !== targetRegion.code // 排除当前区域，稍后单独处理
  );

  // 合并当前区域
  const allRegions = [targetRegion, ...sameLevelRegions];

  // 获取每个区域的GDP数据并排序
  const regionsWithGDP = allRegions
    .map(region => {
      const gdpData = gdpAnnual.find(
        gdp => gdp.regionCode === region.code && gdp.year === CURRENT_YEAR
      );
      return {
        region,
        gdpData,
        gdpValue: gdpData?.value ?? 0
      };
    })
    .filter(item => item.gdpValue > 0) // 过滤掉没有GDP数据的区域
    .sort((a, b) => b.gdpValue - a.gdpValue); // 按GDP降序排序

  // 生成排名列表
  const rankingList: RankingItem[] = regionsWithGDP.map((item, index) => ({
    rank: index + 1,
    region: item.region,
    gdpData: item.gdpData!,
    isCurrent: item.region.code === targetCode
  }));

  return rankingList;
}

/**
 * 获取区域层级的中文名称
 * @param level - 区域层级
 * @returns 中文层级名称
 */
export function getLevelName(level: RegionLevel): string {
  const levelMap: Record<RegionLevel, string> = {
    province: '省级',
    city: '地级',
    district: '县级'
  };
  return levelMap[level] || '';
}

/**
 * 格式化GDP数值（添加千分位分隔符）
 * @param value - GDP数值
 * @returns 格式化后的字符串
 */
export function formatGDP(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)}万亿`;
  }
  return `${value.toLocaleString('zh-CN')}亿`;
}
