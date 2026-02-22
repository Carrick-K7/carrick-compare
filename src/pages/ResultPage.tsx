import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, MapPin, BarChart3, GitCompare, Trophy, Calendar } from 'lucide-react'
import { RegionInfoCard } from '@/components/RegionInfoCard'
import { getRegionByCode, getRegionHistory } from '@/utils/dataLoader'
import type { TimeGranularity } from '@/types/gdp'

export default function ResultPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [granularity, setGranularity] = useState<TimeGranularity>('year')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentYear, setCurrentYear] = useState<number>(2024)

  const regionCode = code || ''
  
  // 加载区域数据
  const region = useMemo(() => getRegionByCode(regionCode), [regionCode])
  
  // 加载历史GDP数据
  const historyData = useMemo(() => {
    if (!region) return []
    return getRegionHistory(regionCode)
  }, [region, regionCode])

  // 处理区域不存在的情况
  if (!region) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-4xl pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                  <MapPin className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">区域不存在</h2>
                <p className="text-muted-foreground">
                  未找到行政区划代码：<code className="bg-muted px-1 py-0.5 rounded">{regionCode}</code>
                </p>
              </div>              
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </div>            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary hidden sm:block" />
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                当前查看: {region.path}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* 桌面端三栏布局 / 移动端单栏堆叠 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 左侧栏：区域信息卡片 */}
          <div className="lg:col-span-3 order-1">
            <RegionInfoCard 
              region={region} 
              gdpData={historyData}
              currentYear={currentYear}
              onYearChange={setCurrentYear}
            />
          </div>

          {/* 中间栏：历史趋势图表（T-009占位） */}
          <div className="lg:col-span-6 order-2">
            <Card className="h-full min-h-[400px]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle>历史趋势图表</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    T-009: 历史趋势图表模块占位
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    {granularity === 'year' ? '年度' : '半年度'}数据视图
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 其他功能占位 */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  <CardTitle>其他功能</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[150px]">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    T-008: 其他功能模块占位
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧栏：相似推荐 + 省内排名 */}
          <div className="lg:col-span-3 order-3 space-y-6">
            {/* 相似区域推荐（T-007占位） */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">相似区域推荐</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[150px]">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    T-007: 相似区域推荐模块占位
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 省内同级排名（T-008占位） */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">省内同级排名</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[150px]">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    T-008: 省内同级排名模块占位
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 底部：时间粒度切换 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">时间粒度:</span>
            </div>            
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={granularity === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGranularity('year')}
                className="text-xs"
              >
                年度
              </Button>
              <Button
                variant={granularity === 'half' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setGranularity('half')}
                className="text-xs"
              >
                半年度
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* 底部占位，防止内容被固定footer遮挡 */}
      <div className="h-14" />
    </div>
  )
}
