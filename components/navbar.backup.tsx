import { Search, Plus, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="w-1/3">
        {/* Placeholder for left side content */}
      </div>
      <div className="w-1/3 flex justify-center">
        <div className="relative w-full max-w-md">
          <Input 
            type="search" 
            placeholder="Suchen..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border-none bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="w-1/3 flex justify-end items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
              <Plus className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Geschäft hinzufügen</DropdownMenuItem>
            <DropdownMenuItem>Kontakt hinzufügen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
              <User className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Einstellungen</DropdownMenuItem>
            <DropdownMenuItem>Abmelden</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

