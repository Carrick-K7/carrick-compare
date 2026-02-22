import type { Region } from './region';
import type { GDPData } from './gdp';

export interface SimilarRegion {
  region: Region;
  gdpData: GDPData;
  diffValue: number;      // GDP差值（亿元）
  diffPercent: number;    // 差值百分比
}

export interface RankingItem {
  rank: number;
  region: Region;
  gdpData: GDPData;
  isCurrent: boolean;
}
