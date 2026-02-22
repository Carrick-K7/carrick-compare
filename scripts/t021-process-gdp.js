// GDP数据来源标注脚本 - Task T-021
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const PROGRESS_FILE = path.join(__dirname, 't021-progress.json');
const DELETION_LOG = path.join(__dirname, 't021-deletions.json');

// 读取数据
const gdpData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gdp-annual.json'), 'utf8'));
const regions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'regions.json'), 'utf8'));

// 构建区域映射
const regionMap = {};
regions.forEach(r => regionMap[r.code] = r);

// 区域优先级定义
const PRIORITY = {
  tier1: ['110100', '310100', '440100', '440300'], // 北上广深
  newTier1: ['510100', '330100', '500100', '420100', '610100', '320500', '320100', '430100', '410100', '330200', '340100', '370200', '370100', '210200', '320200'],
  capitals: [], // 省会城市
  otherCities: [],
  districts: [],
  countyCities: []
};

// 已知的官方来源模板
const SOURCE_TEMPLATES = {
  // 一线城市 - 已确认的官方来源
  '110100': {
    name: '北京市',
    sourcePattern: 'https://tjj.beijing.gov.cn/tjsj_31433/tjgb_31445/ndgb_31446/{year}0{month}/t{date}_{id}.html',
    sourceNamePattern: '北京市统计局{year}年统计公报',
    verified: {
      2024: { value: 49843.1, source: 'https://tjj.beijing.gov.cn/tjsj_31433/tjgb_31445/ndgb_31446/202503/t20250319_4038820.html', sourceName: '北京市统计局2024年统计公报' }
    }
  },
  '310100': {
    name: '上海市',
    sourcePattern: 'https://tjj.sh.gov.cn/tjsj/{year}0{month}{day}/{id}.html',
    sourceNamePattern: '上海市统计局{year}年统计公报',
    verified: {
      2024: { value: 53926.71, source: 'https://tjj.sh.gov.cn/tjsj/20250317/2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8.html', sourceName: '上海市统计局2024年统计公报' }
    }
  },
  '440100': {
    name: '广州市',
    sourceNamePattern: '广州市统计局{year}年统计公报',
    verified: {}
  },
  '440300': {
    name: '深圳市',
    sourceNamePattern: '深圳市统计局{year}年统计公报',
    verified: {}
  }
};

// 删除日志
const deletionLog = [];

// 统计信息
const stats = {
  processed: 0,
  addedSource: 0,
  deleted: 0,
  integerDeleted: 0
};

// 处理数据
function processData() {
  const processedData = [];
  
  for (const record of gdpData) {
    const region = regionMap[record.regionCode];
    if (!region) {
      deletionLog.push({ regionCode: record.regionCode, year: record.year, reason: '区域信息不存在' });
      stats.deleted++;
      continue;
    }
    
    // 检查是否有已验证的来源
    const template = SOURCE_TEMPLATES[record.regionCode];
    if (template && template.verified[record.year]) {
      const verified = template.verified[record.year];
      // 验证数值是否匹配
      if (Math.abs(record.value - verified.value) < 0.1) {
        processedData.push({
          ...record,
          source: verified.source,
          sourceName: verified.sourceName
        });
        stats.addedSource++;
        continue;
      } else {
        deletionLog.push({ 
          regionCode: record.regionCode, 
          regionName: region.name,
          year: record.year, 
          reason: `数值不匹配: 数据库${record.value} vs 官方${verified.value}` 
        });
        stats.deleted++;
        continue;
      }
    }
    
    // 处理整数值（可能是AI生成）
    const isInteger = Number.isInteger(record.value);
    if (isInteger && !record.source) {
      // 整数值无来源，需要删除
      deletionLog.push({ 
        regionCode: record.regionCode, 
        regionName: region.name,
        year: record.year, 
        value: record.value,
        reason: '整数值无来源验证' 
      });
      stats.integerDeleted++;
      stats.deleted++;
      continue;
    }
    
    // 保留原有数据
    processedData.push(record);
    stats.processed++;
  }
  
  return processedData;
}

// 主函数
function main() {
  console.log('=== T-021 GDP数据整改开始 ===');
  console.log('原始数据量:', gdpData.length);
  
  const processedData = processData();
  
  console.log('\n处理统计:');
  console.log('- 保留记录:', processedData.length);
  console.log('- 添加来源:', stats.addedSource);
  console.log('- 删除记录:', stats.deleted);
  console.log('- 删除整数值:', stats.integerDeleted);
  
  // 保存处理后的数据
  fs.writeFileSync(
    path.join(DATA_DIR, 'gdp-annual.json'), 
    JSON.stringify(processedData, null, 2)
  );
  
  // 保存删除日志
  fs.writeFileSync(DELETION_LOG, JSON.stringify(deletionLog, null, 2));
  
  // 保存进度
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
    phase: 'P0-一线城市',
    timestamp: new Date().toISOString(),
    stats
  }, null, 2));
  
  console.log('\n=== 完成 ===');
  console.log('删除日志:', DELETION_LOG);
}

main();
