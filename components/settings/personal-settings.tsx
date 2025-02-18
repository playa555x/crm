'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/auth-context'
import { NewEmployeeForm } from './new-employee-form'

export function PersonalSettings() {
  const { hasPermission } = useAuth()
  const [user, setUser] = useState({
    name: 'Max Mustermann',
    email: 'm.mustermann@example.com',
    language: 'de',
  })

  const handleSave = () => {
    // Here you would typically send the updated user data to your backend
    console.log('Saving user data:', user)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Persönliche Einstellungen</h1>
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Konto</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          {hasPermission('manage_roles') && <TabsTrigger value="employees">Mitarbeiter</TabsTrigger>}
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Kontoinformationen</CardTitle>
              <CardDescription>Hier können Sie Ihre persönlichen Daten ändern.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={user.name} 
                  onChange={(e) => setUser({...user, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user.email} 
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Sprache</Label>
                <select 
                  id="language" 
                  value={user.language} 
                  onChange={(e) => setUser({...user, language: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Änderungen speichern</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungseinstellungen</CardTitle>
              <CardDescription>Konfigurieren Sie, wie und wann Sie benachrichtigt werden möchten.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add notification settings here */}
              <p>Benachrichtigungseinstellungen werden hier implementiert.</p>
            </CardContent>
          </Card>
        </TabsContent>
        {hasPermission('manage_roles') && (
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Neuen Mitarbeiter anlegen</CardTitle>
                <CardDescription>Fügen Sie hier neue Mitarbeiter zum System hinzu.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewEmployeeForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

