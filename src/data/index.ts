import regionsData from './regions.json';
import gdpAnnualData from './gdp-annual.json';
import gdpHalfData from './gdp-half.json';

import type { Region } from '../types/region';
import type { GDPData } from '../types/gdp';

export const regions: Region[] = regionsData as Region[];
export const gdpAnnual: GDPData[] = gdpAnnualData as GDPData[];
export const gdpHalf: GDPData[] = gdpHalfData as GDPData[];

export { regionsData, gdpAnnualData, gdpHalfData };
