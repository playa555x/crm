import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateAccountPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Neuen Account anlegen</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input id="username" placeholder="Benutzername eingeben" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" placeholder="E-Mail eingeben" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" placeholder="Passwort eingeben" />
            </div>
            <Button type="submit">Account erstellen</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

