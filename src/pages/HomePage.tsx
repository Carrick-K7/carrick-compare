import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

const regions = [
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchCode, setSearchCode] = useState('')

  const handleSearch = () => {
    if (searchCode) {
      navigate(`/region/${searchCode.toUpperCase()}`)
    }
  }

  const handleSelect = (value: string) => {
    navigate(`/region/${value}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Carrick Compare
          </h1>
          <p className="text-lg text-slate-600">
            Compare regions and explore data insights
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Search Region</CardTitle>
            <CardDescription>
              Enter a region code or select from the list below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter region code (e.g., US, CN)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="pt-4">
              <p className="text-sm text-slate-500 mb-2">Or select a region:</p>
              <Select onValueChange={handleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name} ({region.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.slice(0, 4).map((region) => (
            <Card
              key={region.code}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/region/${region.code}`)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{region.code}</div>
                <div className="text-sm text-slate-600">{region.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
