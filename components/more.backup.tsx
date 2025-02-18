import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function More() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mehr</h2>
      <Card>
        <CardHeader>
          <CardTitle>Zusätzliche Funktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Weitere Funktionen und Einstellungen werden hier implementiert.</p>
        </CardContent>
      </Card>
    </div>
  )
}

