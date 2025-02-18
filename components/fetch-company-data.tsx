'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Building } from 'lucide-react'

interface CompanyData {
  name: string
  street: string
  postcode: string
  city: string
  website: string
}

export function FetchCompanyData({ onDataFetched }: { onDataFetched: (data: CompanyData) => void }) {
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // In a real-world scenario, this would be an API call to a company data provider
      // For this example, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: CompanyData = {
        name: companyName,
        street: 'Beispielstraße 123',
        postcode: '12345',
        city: 'Musterstadt',
        website: `www.${companyName.toLowerCase().replace(/\s+/g, '-')}.de`,
      }
      
      onDataFetched(mockData)
    } catch (error) {
      console.error('Error fetching company data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Building className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unternehmensdaten abrufen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              Firmenname
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={fetchData} disabled={isLoading}>
          {isLoading ? 'Lädt...' : 'Daten abrufen'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

