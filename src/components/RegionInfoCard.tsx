import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Region } from '@/types/region';
import type { GDPData } from '@/types/gdp';
import { cn } from '@/utils';
import { LevelBadge } from '@/components/LevelBadge';

interface RegionInfoCardProps {
  region: Region;
  gdpData?: GDPData[];
  currentYear?: number;
  onYearChange?: (year: number) => void;
  className?: string;
}

/**
 * 区域信息卡片组件
 * 展示选中区域的GDP数据、完整路径等关键信息
 */
export const RegionInfoCard: React.FC<RegionInfoCardProps> = ({
  region,
  gdpData = [],
  currentYear = 2023,
  onYearChange,
  className,
}) => {
  const navigate = useNavigate();

  // 解析路径为面包屑项
  const breadcrumbItems = useMemo(() => {
    const items: { name: string; code: string; isCurrent: boolean }[] = [];
    
    // 根据路径字符串解析（如 "广东省深圳市南山区"）
    const pathParts = region.path.split(/(?<=省)|(?<=市)|(?<=区)|(?<=县)/).filter(Boolean);
    
    // 为每个路径部分找到对应的 code
    // 这里简化处理：只有当前区域是最后一项
    pathParts.forEach((part, index) => {
      const isCurrent = index === pathParts.length - 1;
      // 对于非当前项，我们使用简化逻辑找到上级代码
      // 实际项目中应该通过 parentCode 链找到完整的层级
      let code = region.code;
      if (!isCurrent) {
        // 根据层级推断上级代码
        if (region.level === 'district' && index === 0) {
          code = region.provinceCode;
        } else if (region.level === 'district' && index === 1) {
          code = region.parentCode || region.provinceCode;
        } else if (region.level === 'city' && index === 0) {
          code = region.provinceCode;
        }
      }
      
      items.push({
        name: part,
        code,
        isCurrent,
      });
    });

    // 如果没有解析出路径，至少显示当前区域
    if (items.length === 0) {
      items.push({
        name: region.name,
        code: region.code,
        isCurrent: true,
      });
    }

    return items;
  }, [region]);

  // 获取当前年份的GDP数据
  const currentGDP = useMemo(() => {
    if (!gdpData || !currentYear) return undefined;
    return gdpData.find(
      (d) => d.year === currentYear && d.period === 1 && d.granularity === 'year'
    );
  }, [gdpData, currentYear]);

  // 获取上一年的GDP数据
  const previousGDP = useMemo(() => {
    if (!gdpData || !currentYear) return undefined;
    return gdpData.find(
      (d) => d.year === currentYear - 1 && d.period === 1 && d.granularity === 'year'
    );
  }, [gdpData, currentYear]);

  // 计算GDP变化趋势
  const trend = useMemo(() => {
    if (!currentGDP || !previousGDP) return null;
    const change = currentGDP.value - previousGDP.value;
    const percentChange = (change / previousGDP.value) * 100;
    return {
      change,
      percentChange,
      isPositive: change >= 0,
    };
  }, [currentGDP, previousGDP]);

  // 格式化GDP数值（千分位）
  const formatGDP = (value: number): string => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // 处理面包屑点击
  const handleBreadcrumbClick = (code: string, isCurrent: boolean) => {
    if (!isCurrent) {
      navigate(`/region/${code}`);
    }
  };

  // 处理年份变化
  const handleYearChange = (value: string) => {
    if (onYearChange) {
      onYearChange(Number(value));
    }
  };

  // 生成年份选项 (2015-2024)
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let year = 2024; year >= 2015; year--) {
      years.push(year);
    }
    return years;
  }, []);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        {/* 区域名称 */}
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          {region.name}
          <LevelBadge level={region.level} className="ml-2" />
        </CardTitle>

        {/* 面包屑路径 */}
        <Breadcrumb className="mt-2">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={`${item.code}-${index}`}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.isCurrent ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => handleBreadcrumbClick(item.code, item.isCurrent)}
                    >
                      {item.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* 行政区划代码 */}
        <CardDescription className="mt-2">
          行政区划代码: <span className="font-mono text-foreground">{region.code}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GDP 数值展示 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {currentYear}年 GDP
            </span>
            
            {/* 年份选择器 */}
            <Select
              value={String(currentYear)}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-28 h-8 text-sm">
                <SelectValue placeholder="选择年份" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentGDP ? (
            <div className="space-y-2">
              <div className="text-4xl font-bold tracking-tight">
                {formatGDP(currentGDP.value)}
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  亿元
                </span>
              </div>

              {/* 变化趋势 */}
              {trend && (
                <div
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {trend.isPositive ? '+' : ''}
                    {formatGDP(Math.abs(trend.change))} 亿元
                  </span>
                  <span className="text-muted-foreground">
                    ({trend.isPositive ? '+' : ''}
                    {trend.percentChange.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground py-4">
              暂无 {currentYear} 年数据
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionInfoCard;
