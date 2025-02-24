"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, User, Bell } from 'lucide-react'
import { AdvancedSearch } from "@/components/advanced-search"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Neue Anfrage von Kunde XYZ" },
    { id: 2, message: "Rechnung für Projekt ABC fällig" },
    { id: 3, message: "Termin mit Lieferant in 2 Stunden" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Solar CRM</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <AdvancedSearch />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(true)}>
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">username</p>
                  <p className="text-xs leading-none text-muted-foreground">m@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Persönliche Einstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/company-settings">Firmeneinstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create-account">Neuen Account anlegen</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benachrichtigungen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <p>{notification.message}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotifications(notifications.filter((n) => n.id !== notification.id))}
                >
                  Entfernen
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}