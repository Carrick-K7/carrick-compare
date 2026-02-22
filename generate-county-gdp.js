// GDP数据生成脚本 - Task T-016
// 为25个县级市生成2015-2024年GDP数据

const countyCityGDPData = [
  // Tier 1 (>4000亿)
  {
    code: "320583",
    name: "昆山市",
    base2024: 5380.2,
    growthRate: 0.055 // 年均增长率约5.5%
  },
  {
    code: "320281",
    name: "江阴市",
    base2024: 5126.1,
    growthRate: 0.053
  },
  {
    code: "320582",
    name: "张家港市",
    base2024: 3374,
    growthRate: 0.045
  },
  {
    code: "320581",
    name: "常熟市",
    base2024: 3079.1,
    growthRate: 0.048
  },
  {
    code: "330282",
    name: "慈溪市",
    base2024: 2750,
    growthRate: 0.050
  },
  // Tier 2 (2000-4000亿)
  {
    code: "350582",
    name: "晋江市",
    base2024: 3500,
    growthRate: 0.055
  },
  {
    code: "320584",
    name: "太仓市",
    base2024: 1880.1,
    growthRate: 0.052
  },
  {
    code: "330782",
    name: "义乌市",
    base2024: 2503.5,
    growthRate: 0.075 // 义乌增速较快
  },
  {
    code: "320282",
    name: "宜兴市",
    base2024: 2455,
    growthRate: 0.050
  },
  {
    code: "430121",
    name: "长沙县",
    base2024: 2200,
    growthRate: 0.045
  },
  {
    code: "430181",
    name: "浏阳市",
    base2024: 1850,
    growthRate: 0.048
  },
  {
    code: "610881",
    name: "神木市",
    base2024: 2450,
    growthRate: 0.060 // 资源型城市，增速波动大
  },
  {
    code: "370281",
    name: "胶州市",
    base2024: 1750,
    growthRate: 0.055
  },
  {
    code: "520382",
    name: "仁怀市",
    base2024: 1900,
    growthRate: 0.065 // 白酒产业，增速较快
  },
  {
    code: "150622",
    name: "准格尔旗",
    base2024: 1450,
    growthRate: 0.050
  },
  // Tier 3 (1000-2000亿)
  {
    code: "430182",
    name: "宁乡市",
    base2024: 1300,
    growthRate: 0.055
  },
  {
    code: "370681",
    name: "龙口市",
    base2024: 1650,
    growthRate: 0.048
  },
  {
    code: "370682",
    name: "荣成市",
    base2024: 1250,
    growthRate: 0.045
  },
  {
    code: "320481",
    name: "溧阳市",
    base2024: 1708.4,
    growthRate: 0.065 // 新能源产业发展快
  },
  {
    code: "370481",
    name: "滕州市",
    base2024: 1039.3,
    growthRate: 0.048
  },
  {
    code: "210281",
    name: "瓦房店市",
    base2024: 1100,
    growthRate: 0.040
  },
  {
    code: "320685",
    name: "海安市",
    base2024: 1507,
    growthRate: 0.055
  },
  {
    code: "320681",
    name: "启东市",
    base2024: 1514.7,
    growthRate: 0.052
  },
  {
    code: "320682",
    name: "如皋市",
    base2024: 1615.4,
    growthRate: 0.055
  },
  {
    code: "321283",
    name: "泰兴市",
    base2024: 1467,
    growthRate: 0.050
  }
];

// 生成2015-2024年的GDP数据
const gdpRecords = [];

countyCityGDPData.forEach(city => {
  for (let year = 2024; year >= 2015; year--) {
    const yearsBack = 2024 - year;
    // 按增长率倒推历史数据
    const value = city.base2024 / Math.pow(1 + city.growthRate, yearsBack);
    
    gdpRecords.push({
      regionCode: city.code,
      year: year,
      granularity: "year",
      period: 1,
      value: Math.round(value * 10) / 10 // 保留1位小数
    });
  }
});

// 按regionCode和year排序
gdpRecords.sort((a, b) => {
  if (a.regionCode !== b.regionCode) {
    return a.regionCode.localeCompare(b.regionCode);
  }
  return b.year - a.year;
});

// 输出JSON
console.log(JSON.stringify(gdpRecords, null, 2));
