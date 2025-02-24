"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing up:', error.message)
    } else {
      setView('sign-in')
    }
    
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
    
    setLoading(false)
  }

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>{view === 'sign-in' ? 'Anmelden' : 'Registrieren'}</CardTitle>
        <CardDescription>
          {view === 'sign-in' 
            ? 'Geben Sie Ihre Anmeldedaten ein' 
            : 'Erstellen Sie ein neues Konto'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Laden...' : view === 'sign-in' ? 'Anmelden' : 'Registrieren'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          {view === 'sign-in' ? (
            <Button
              variant="link"
              onClick={() => setView('sign-up')}
            >
              Noch kein Konto? Registrieren
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={() => setView('sign-in')}
            >
              Bereits ein Konto? Anmelden
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}