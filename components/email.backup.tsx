import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Email() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">E-Mail</h2>
      <Card>
        <CardHeader>
          <CardTitle>E-Mail-Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>E-Mail-Funktionalität wird hier implementiert.</p>
        </CardContent>
      </Card>
    </div>
  )
}

