import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Employees() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mitarbeiter</h2>
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiterverwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Mitarbeiterverwaltungsfunktionen werden hier implementiert.</p>
        </CardContent>
      </Card>
    </div>
  )
}

