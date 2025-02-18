'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'

const navItems = [
  { icon: Icons.home, label: 'Dashboard', href: '/' },
  { icon: Icons.users, label: 'Kontakte', href: '/contacts' },
  { icon: Icons.solarPanel, label: 'Projekte', href: '/projects' },
  { icon: Icons.box, label: 'Inventar', href: '/inventory' },
  { icon: Icons.graduationCap, label: 'Schulungen', href: '/training' },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className="mr-4 flex">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Solar CRM
          </span>
        </Link>
        <nav className="flex items-center space-x-2">
          {navItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    pathname === item.href
                      ? 'bg-muted hover:bg-muted'
                      : 'hover:bg-transparent hover:text-foreground',
                    'relative'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  )
}

