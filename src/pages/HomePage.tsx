import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { SearchBox } from '@/components/SearchBox'
import { getHotCities } from '@/utils/search'
import { TrendingUp, MapPin, BarChart3 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const hotCities = getHotCities()

  const handleCityClick = (code: string) => {
    navigate(`/region/${code}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="w-full py-4 px-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-slate-900">Carrick Compare</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            行政区域 GDP 对比
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            查询中国各城市经济数据
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-10">
          <SearchBox autoFocus placeholder="搜索城市名称或区划代码..." />
        </div>

        {/* Hot Cities */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">热门城市</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hotCities.map((city) => (
              <Card
                key={city.code}
                className="cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                onClick={() => handleCityClick(city.code)}
              >
                <CardContent className="p-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 border-slate-200">
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">全国覆盖</h3>
              <p className="text-sm text-slate-600">支持省、市、区三级行政区域数据</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-slate-200">
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">历史数据</h3>
              <p className="text-sm text-slate-600">查看历年 GDP 增长趋势和变化</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-slate-200">
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">对比分析</h3>
              <p className="text-sm text-slate-600">多城市数据对比，一目了然</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
