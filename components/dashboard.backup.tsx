import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gesamte Geschäfte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
          <p className="text-xs text-muted-foreground">+10% gegenüber dem Vormonat</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gesamtwert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45.231 €</div>
          <p className="text-xs text-muted-foreground">+20% gegenüber dem Vormonat</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Neue Kontakte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32</div>
          <p className="text-xs text-muted-foreground">+5% gegenüber dem Vormonat</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Erfolgsquote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">35%</div>
          <p className="text-xs text-muted-foreground">+2% gegenüber dem Vormonat</p>
        </CardContent>
      </Card>
    </div>
  )
}

