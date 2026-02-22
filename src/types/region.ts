export type RegionLevel = 'province' | 'city' | 'district';

export interface Region {
  code: string;           // 行政区划代码 (如 440300)
  name: string;           // 名称 (如 深圳市)
  level: RegionLevel;
  parentCode?: string;    // 上级代码
  provinceCode: string;   // 所属省级代码
  path: string;           // 完整路径 (如 "广东省深圳市")
}
