import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, MapPin, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LevelBadge } from '@/components/LevelBadge';
import { findSimilarRegions, getDiffColorClass } from '@/utils/similarity';
import { cn } from '@/utils';
import type { SimilarRegion } from '@/utils/similarity';

interface SimilarRegionsListProps {
  regionCode: string;
  year?: number;
  className?: string;
}

const INITIAL_DISPLAY_COUNT = 5;

/**
 * 相似区域推荐列表组件
 * 展示与当前区域GDP相近的其他省份区域
 */
export const SimilarRegionsList: React.FC<SimilarRegionsListProps> = ({
  regionCode,
  year = 2023,
  className,
}) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  // 计算相似区域
  const similarRegions = useMemo(() => {
    if (!regionCode) return [];
    return findSimilarRegions(regionCode, { 
      limit: 10, 
      sameLevelOnly: true,
      year,
    });
  }, [regionCode, year]);

  // 格式化GDP数值（千分位）
  const formatGDP = (value: number): string => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // 处理区域点击跳转
  const handleRegionClick = (code: string) => {
    navigate(`/region/${code}`);
  };

  // 处理加载更多/收起
  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  // 决定显示哪些区域
  const displayRegions = showAll 
    ? similarRegions 
    : similarRegions.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMore = similarRegions.length > INITIAL_DISPLAY_COUNT;

  // 如果没有相似区域，显示空状态
  if (similarRegions.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">GDP相近的区域（其他省）</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">暂无可推荐的相似区域</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">GDP相近的区域（其他省）</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {similarRegions.length}个结果
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {displayRegions.map((item, index) => (
            <SimilarRegionItem
              key={item.region.code}
              item={item}
              index={index}
              formatGDP={formatGDP}
              onClick={() => handleRegionClick(item.region.code)}
            />
          ))}
        </div>

        {/* 加载更多/收起按钮 */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleShowAll}
            className="w-full mt-4 text-muted-foreground hover:text-foreground"
          >
            {showAll ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1 rotate-180" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                加载更多 ({similarRegions.length - INITIAL_DISPLAY_COUNT}个)
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * 单个相似区域项组件
 */
interface SimilarRegionItemProps {
  item: SimilarRegion;
  index: number;
  formatGDP: (value: number) => string;
  onClick: () => void;
}

const SimilarRegionItem: React.FC<SimilarRegionItemProps> = ({
  item,
  index,
  formatGDP,
  onClick,
}) => {
  const colorClass = getDiffColorClass(item.diffPercent);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-3 rounded-lg border cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary/50 hover:bg-accent/50'
      )}
    >
      {/* 排名序号 */}
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
        {index + 1}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* 区域路径 */}
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={item.region.path}>
              {item.region.path}
            </span>
            <LevelBadge level={item.region.level} />
          </div>

          {/* GDP数值 */}
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {formatGDP(item.gdpData.value)} 亿元
            </span>
          </div>
        </div>

        {/* 跳转箭头 */}
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </div>

      {/* 差值标签 */}
      <div className="mt-2 flex items-center justify-between">
        <Badge 
          variant="outline" 
          className={cn('text-xs font-normal', colorClass)}
        >
          ±{formatGDP(item.diffValue)}亿元
        </Badge>
        <span className={cn('text-xs', colorClass.split(' ')[0])}>
          ±{item.diffPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default SimilarRegionsList;
