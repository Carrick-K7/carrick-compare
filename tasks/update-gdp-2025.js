import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2025年GDP数据（单位：亿元）
const gdp2025Data = [
  { regionCode: "110100", value: 52073.4, note: "北京，增长5.4%" },
  { regionCode: "310100", value: 56708.71, note: "上海，增长5.4%" },
  { regionCode: "440100", value: 32039.46, note: "广州" },
  { regionCode: "440300", value: 38731.80, note: "深圳" },
  { regionCode: "500100", value: 33753.93, note: "重庆" },
  { regionCode: "320500", value: 27700, note: "苏州，预计数" },
  { regionCode: "330300", value: 10213.9, note: "温州，增长6.1%" },
  { regionCode: "210200", value: 10002.1, note: "大连，增长5.7%" },
];

const dataFile = path.join(__dirname, '../src/data/gdp-annual.json');

// 读取现有数据
const rawData = fs.readFileSync(dataFile, 'utf-8');
const data = JSON.parse(rawData);

console.log(`原始数据条目数: ${data.length}`);

// 检查是否已有2025年数据
const existing2025 = data.filter(d => d.year === 2025);
console.log(`已有2025年数据条目: ${existing2025.length}`);

// 添加2025年数据
let addedCount = 0;
for (const item of gdp2025Data) {
  // 检查是否已存在该城市2025年数据
  const exists = data.some(d => d.regionCode === item.regionCode && d.year === 2025);
  
  if (exists) {
    console.log(`⚠️ 已存在2025年数据: ${item.regionCode} - ${item.note}`);
    continue;
  }
  
  // 添加新数据
  data.push({
    regionCode: item.regionCode,
    year: 2025,
    granularity: "year",
    period: 1,
    value: item.value
  });
  
  console.log(`✅ 添加: ${item.regionCode} = ${item.value}亿元 (${item.note})`);
  addedCount++;
}

console.log(`\n新增数据条目: ${addedCount}`);
console.log(`更新后数据条目: ${data.length}`);

// 保存数据
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('\n✅ 数据已保存到 gdp-annual.json');
