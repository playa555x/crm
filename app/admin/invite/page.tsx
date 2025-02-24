"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function InviteUserPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setMessage("Einladung erfolgreich versendet!")
      setEmail("")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Benutzer einladen</CardTitle>
          <CardDescription>
            Laden Sie neue Teammitglieder zum CRM ein
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleInvite}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="neue@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {message && (
              <p className={`text-sm ${message.includes("Fehler") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Wird gesendet..." : "Einladung senden"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}