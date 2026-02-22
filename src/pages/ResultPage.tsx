import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, MapPin, Users, TrendingUp } from 'lucide-react'

// Mock data for demonstration
const mockRegionData: Record<string, {
  name: string
  population: string
  gdp: string
  growth: string
  description: string
}> = {
  US: {
    name: 'United States',
    population: '331.9 million',
    gdp: '$23.32 trillion',
    growth: '+5.9%',
    description: 'The United States is the world\'s largest economy, characterized by high productivity, technological innovation, and diverse industries.'
  },
  CN: {
    name: 'China',
    population: '1.41 billion',
    gdp: '$17.73 trillion',
    growth: '+8.1%',
    description: 'China is the world\'s second-largest economy, known for its rapid growth, manufacturing capabilities, and expanding technology sector.'
  },
  GB: {
    name: 'United Kingdom',
    population: '67.5 million',
    gdp: '$3.13 trillion',
    growth: '+7.4%',
    description: 'The UK has a highly developed social market economy, with significant contributions from services, manufacturing, and creative industries.'
  },
  DE: {
    name: 'Germany',
    population: '83.2 million',
    gdp: '$4.26 trillion',
    growth: '+2.9%',
    description: 'Germany is Europe\'s largest economy, renowned for its automotive industry, engineering excellence, and export-oriented economy.'
  },
  JP: {
    name: 'Japan',
    population: '125.7 million',
    gdp: '$4.94 trillion',
    growth: '+1.6%',
    description: 'Japan is known for its advanced technology, automotive industry, and unique blend of traditional and modern culture.'
  },
  FR: {
    name: 'France',
    population: '67.8 million',
    gdp: '$2.94 trillion',
    growth: '+7.0%',
    description: 'France has a diverse economy with strong tourism, agriculture, luxury goods, and aerospace sectors.'
  },
  IN: {
    name: 'India',
    population: '1.40 billion',
    gdp: '$3.18 trillion',
    growth: '+8.7%',
    description: 'India is one of the world\'s fastest-growing major economies, with a young population and thriving technology sector.'
  },
  BR: {
    name: 'Brazil',
    population: '214.3 million',
    gdp: '$1.61 trillion',
    growth: '+4.6%',
    description: 'Brazil is the largest economy in Latin America, rich in natural resources with a diverse industrial base.'
  }
}

export default function ResultPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  
  const regionCode = code?.toUpperCase() || ''
  const data = mockRegionData[regionCode]

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-4xl pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Region Not Found</h2>
              <p className="text-slate-600 mb-6">
                We couldn\'t find data for region code: {regionCode}
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-4xl pt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl">{data.name}</CardTitle>
                <CardDescription>Region Code: {regionCode}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{data.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-slate-500">Population</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{data.population}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-slate-500">GDP</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{data.gdp}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-slate-500">Growth Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{data.growth}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              Comparative analysis for {data.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Strong economic fundamentals with diversified sectors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Stable growth trajectory over the past decade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Attractive destination for foreign investment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Well-developed infrastructure and institutions</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
