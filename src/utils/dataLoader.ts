import { regions, gdpAnnual, gdpHalf } from '../data';
import type { Region, RegionLevel } from '../types/region';
import type { GDPData, TimeGranularity } from '../types/gdp';

/**
 * 根据行政区划代码获取区域信息
 * @param code - 行政区划代码
 * @returns 区域信息或 undefined
 */
export function getRegionByCode(code: string): Region | undefined {
  return regions.find(region => region.code === code);
}

/**
 * 根据行政级别获取所有区域
 * @param level - 行政级别
 * @returns 该级别的所有区域
 */
export function getRegionsByLevel(level: RegionLevel): Region[] {
  return regions.filter(region => region.level === level);
}

/**
 * 获取指定区域的子区域
 * @param parentCode - 父区域代码
 * @returns 子区域列表
 */
export function getChildRegions(parentCode: string): Region[] {
  return regions.filter(region => region.parentCode === parentCode);
}

/**
 * 获取指定区域的GDP数据
 * @param code - 区域代码
 * @param year - 年份
 * @param granularity - 时间粒度
 * @returns GDP数据或 undefined
 */
export function getRegionGDP(
  code: string,
  year: number,
  granularity: TimeGranularity
): GDPData | undefined {
  const dataSource = granularity === 'year' ? gdpAnnual : gdpHalf;
  return dataSource.find(
    gdp => gdp.regionCode === code && gdp.year === year && gdp.granularity === granularity
  );
}

/**
 * 获取指定区域的历史GDP数据
 * @param code - 区域代码
 * @returns 该区域的全部历史GDP数据
 */
export function getRegionHistory(code: string): GDPData[] {
  const annualData = gdpAnnual.filter(gdp => gdp.regionCode === code);
  const halfData = gdpHalf.filter(gdp => gdp.regionCode === code);
  return [...annualData, ...halfData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.granularity !== b.granularity) {
      return a.granularity === 'half' ? -1 : 1;
    }
    return a.period - b.period;
  });
}

/**
 * 获取指定年份和粒度的所有GDP数据
 * @param year - 年份
 * @param granularity - 时间粒度
 * @returns GDP数据列表
 */
export function getGDPByYearAndGranularity(
  year: number,
  granularity: TimeGranularity
): GDPData[] {
  const dataSource = granularity === 'year' ? gdpAnnual : gdpHalf;
  return dataSource.filter(gdp => gdp.year === year && gdp.granularity === granularity);
}

/**
 * 根据名称搜索区域
 * @param name - 区域名称（支持部分匹配）
 * @returns 匹配的区域列表
 */
export function searchRegionsByName(name: string): Region[] {
  const searchTerm = name.toLowerCase();
  return regions.filter(region => region.name.toLowerCase().includes(searchTerm));
}
