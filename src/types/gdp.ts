export type TimeGranularity = 'year' | 'half';

export interface GDPData {
  regionCode: string;
  year: number;           // 2015-2024
  granularity: TimeGranularity;
  period: 1 | 2;          // 1=年度/上半年, 2=下半年
  value: number;          // GDP数值（亿元）
}
