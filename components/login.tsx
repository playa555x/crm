'use client'

import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      {/* Golden gradient background effect */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#b69c64]/20 via-[#e4cc89]/20 to-[#b69c64]/20 blur-3xl"></div>
      
      {/* Login form container */}
      <div className="w-[400px] p-8 rounded-2xl relative backdrop-blur-xl bg-black/10 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#b69c64]/10 via-[#e4cc89]/10 to-[#b69c64]/10 rounded-2xl"></div>
        
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Login</h1>
          
          <div className="relative">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Benutzername"
              className="w-full bg-white/10 border-white/20 text-white backdrop-blur-sm rounded-full pl-10 placeholder:text-white/70 focus:ring-0 focus:border-white/40"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
          </div>
          
          <div className="relative">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full bg-white/10 border-white/20 text-white backdrop-blur-sm rounded-full pl-10 placeholder:text-white/70 focus:ring-0 focus:border-white/40"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
          </div>
          
          <div className="text-right">
            <Link 
              href="/forgot-password"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Passwort vergessen?
            </Link>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90 rounded-full py-6 text-lg font-medium transition-all duration-200"
          >
            Login
          </Button>
          
          <div className="text-center mt-6">
            <span className="text-white/70">Noch keinen Account? </span>
            <Link 
              href="/register"
              className="text-white hover:text-white/90 transition-colors"
            >
              Registrieren
            </Link>
          </div>
        </form>
      </div>
      
      {/* Bottom text */}
      <div className="absolute bottom-10 text-center">
        <h2 className="text-8xl font-bold bg-gradient-to-r from-[#b69c64] via-[#e4cc89] to-[#b69c64] text-transparent bg-clip-text">
          MAKE A TRADE
        </h2>
      </div>
    </div>
  )
}

