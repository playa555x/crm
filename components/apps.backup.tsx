import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Apps() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Apps</h2>
      <Card>
        <CardHeader>
          <CardTitle>App-Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>App-Integrationsfunktionen werden hier implementiert.</p>
        </CardContent>
      </Card>
    </div>
  )
}

