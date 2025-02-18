import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Company {
  name: string
  industry: string
  employees: number
  revenue: string
  website: string
  description: string
}

interface CompanyTabProps {
  company: Company
}

export function CompanyTab({ company }: CompanyTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmensinformationen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Firmenname</Label>
              <Input id="companyName" value={company.name} readOnly />
            </div>
            <div>
              <Label htmlFor="industry">Branche</Label>
              <Input id="industry" value={company.industry} readOnly />
            </div>
            <div>
              <Label htmlFor="employees">Mitarbeiteranzahl</Label>
              <Input id="employees" value={company.employees} readOnly />
            </div>
            <div>
              <Label htmlFor="revenue">Umsatz</Label>
              <Input id="revenue" value={company.revenue} readOnly />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={company.website} readOnly />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea id="description" value={company.description} readOnly className="h-32" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline">Unternehmen bearbeiten</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

