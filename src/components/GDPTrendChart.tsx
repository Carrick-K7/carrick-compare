import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { GDPData, TimeGranularity } from '@/types/gdp';

interface GDPTrendChartProps {
  data: GDPData[];
  granularity: TimeGranularity;
  regionName: string;
}

interface ChartDataPoint {
  label: string;
  year: number;
  period: number;
  value: number;
  growth?: number;
  growthRate?: number;
}

// 格式化数值（亿元）
function formatValue(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)}万亿`;
  }
  return `${value.toFixed(1)}亿`;
}

// 自定义 Tooltip 组件
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length > 0) {
    const point = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-1">{label}</p>
        <p className="text-primary font-bold text-lg">
          {formatValue(point.value)}
        </p>
        {point.growth !== undefined && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              较上期：
              <span
                className={
                  point.growth >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {point.growth >= 0 ? '+' : ''}
                {formatValue(point.growth)}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              增长率：
              <span
                className={
                  point.growthRate! >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {point.growthRate! >= 0 ? '+' : ''}
                {point.growthRate?.toFixed(2)}%
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function GDPTrendChart({ data, granularity, regionName }: GDPTrendChartProps) {
  // 处理数据：按时间粒度筛选并排序
  const chartData = useMemo((): ChartDataPoint[] => {
    const filtered = data
      .filter((d) => d.granularity === granularity)
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.period - b.period;
      });

    return filtered.map((item, index) => {
      const prevItem = index > 0 ? filtered[index - 1] : null;
      const growth = prevItem ? item.value - prevItem.value : undefined;
      const growthRate = prevItem
        ? ((item.value - prevItem.value) / prevItem.value) * 100
        : undefined;

      // 生成标签：年度显示年份，半年度显示"2023H1"格式
      const label =
        granularity === 'year'
          ? `${item.year}`
          : `${item.year}H${item.period}`;

      return {
        label,
        year: item.year,
        period: item.period,
        value: item.value,
        growth,
        growthRate,
      };
    });
  }, [data, granularity]);

  // 计算最大值和最小值用于标注
  const { maxPoint, minPoint } = useMemo(() => {
    if (chartData.length === 0) {
      return { maxPoint: null, minPoint: null };
    }

    let max = chartData[0];
    let min = chartData[0];

    for (const point of chartData) {
      if (point.value > max.value) max = point;
      if (point.value < min.value) min = point;
    }

    return { maxPoint: max, minPoint: min };
  }, [chartData]);

  // 如果没有数据，显示空状态
  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>GDP历史趋势</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">暂无数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">GDP历史趋势</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">{regionName}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value: number) => {
                  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
                  return `${value}`;
                }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 3,
                  r: 6,
                }}
              />
              {/* 最大值标注点 */}
              {maxPoint && (
                <ReferenceDot
                  x={maxPoint.label}
                  y={maxPoint.value}
                  r={6}
                  fill="#22c55e"
                  stroke="#22c55e"
                  label={{
                    value: '最高',
                    position: 'top',
                    fill: '#22c55e',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
              )}
              {/* 最小值标注点 */}
              {minPoint && minPoint.label !== maxPoint?.label && (
                <ReferenceDot
                  x={minPoint.label}
                  y={minPoint.value}
                  r={6}
                  fill="#ef4444"
                  stroke="#ef4444"
                  label={{
                    value: '最低',
                    position: 'bottom',
                    fill: '#ef4444',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* 数据摘要 */}
        <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>当前: {formatValue(chartData[chartData.length - 1]?.value || 0)}</span>
          </div>
          {maxPoint && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>最高: {formatValue(maxPoint.value)}</span>
            </div>
          )}
          {minPoint && minPoint.label !== maxPoint?.label && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>最低: {formatValue(minPoint.value)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
