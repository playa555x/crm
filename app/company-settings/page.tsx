import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompanySettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Firmeneinstellungen</h1>
      <Card>
        <CardHeader>
          <CardTitle>Firmendetails</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Hier können Sie Ihre Firmeneinstellungen verwalten.</p>
          {/* Add form fields for company settings here */}
        </CardContent>
      </Card>
    </div>
  )
}

