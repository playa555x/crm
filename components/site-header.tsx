import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { MainNav } from '@/components/main-nav'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-xl flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Suchen..."
              className="md:w-[300px] lg:w-[400px]"
            />
          </div>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Icons.user className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Max Mustermann</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    max@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

