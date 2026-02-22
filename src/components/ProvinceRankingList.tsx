import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LevelBadge } from '@/components/LevelBadge';
import { getProvinceRanking, getLevelName, formatGDP } from '@/utils/ranking';
import { getRegionByCode } from '@/utils/dataLoader';
import type { RankingItem } from '@/types/comparison';

interface ProvinceRankingListProps {
  regionCode: string;
}

// 获取排名图标
function getRankIcon(rank: number): React.ReactNode {
  switch (rank) {
    case 1:
      return <span className="text-lg">🥇</span>;
    case 2:
      return <span className="text-lg">🥈</span>;
    case 3:
      return <span className="text-lg">🥉</span>;
    default:
      return <span className="text-muted-foreground font-medium">{rank}</span>;
  }
}

// 获取排名行的样式
function getRowStyles(item: RankingItem): string {
  const baseStyles = "cursor-pointer transition-colors hover:bg-muted/70";
  
  if (item.isCurrent) {
    return `${baseStyles} bg-primary/10 hover:bg-primary/15 font-medium`;
  }
  
  if (item.rank <= 3) {
    return `${baseStyles} bg-amber-50/50 dark:bg-amber-950/20`;
  }
  
  return baseStyles;
}

export function ProvinceRankingList({ regionCode }: ProvinceRankingListProps) {
  const navigate = useNavigate();
  
  const rankingData = useMemo(() => {
    return getProvinceRanking(regionCode);
  }, [regionCode]);

  const currentRegion = useMemo(() => {
    return getRegionByCode(regionCode);
  }, [regionCode]);

  // 获取标题
  const title = useMemo(() => {
    if (!currentRegion) return '省内同级排名';
    const provinceName = currentRegion.path.split('省')[0]?.replace(/市$|自治区$/, '') || '';
    const levelName = getLevelName(currentRegion.level);
    return `${provinceName}${levelName}行政区GDP排名`;
  }, [currentRegion]);

  // 处理点击跳转
  const handleRowClick = (code: string) => {
    if (code !== regionCode) {
      navigate(`/region/${code}`);
    }
  };

  if (!currentRegion) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">省内同级排名</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            无法获取区域信息
          </p>
        </CardContent>
      </Card>
    );
  }

  if (rankingData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            暂无可用的排名数据
          </p>
        </CardContent>
      </Card>
    );
  }

  // 找到当前区域的排名信息
  const currentRanking = rankingData.find(item => item.isCurrent);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {currentRanking && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">第</span>
              <span className="font-bold text-primary">{currentRanking.rank}</span>
              <span className="text-muted-foreground">名</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">排名</TableHead>
                <TableHead>区域</TableHead>
                <TableHead className="text-right">GDP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingData.map((item) => (
                <TableRow
                  key={item.region.code}
                  className={getRowStyles(item)}
                  onClick={() => handleRowClick(item.region.code)}
                >
                  <TableCell className="text-center">
                    {getRankIcon(item.rank)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={item.isCurrent ? 'font-semibold text-primary' : ''}>
                          {item.region.name}
                        </span>
                        <LevelBadge level={item.region.level} />
                      </div>
                      {item.isCurrent && (
                        <span className="text-xs text-muted-foreground">当前</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatGDP(item.gdpData.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground px-4 py-2 border-t">
          数据年份：2025年 | 点击行可跳转查看详情
        </p>
      </CardContent>
    </Card>
  );
}
