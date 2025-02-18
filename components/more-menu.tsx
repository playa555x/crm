'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Settings, Users, FileText, BarChart2, Workflow, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const menuItems = [
  { icon: Settings, label: 'Einstellungen', href: '/settings' },
  { icon: Users, label: 'Benutzerverwaltung', href: '/users' },
  { icon: BarChart2, label: 'Berichte', href: '/reports' },
  { icon: Workflow, label: 'Automatisierung', href: '/automation' },
  { icon: FileSpreadsheet, label: 'Daten', href: '/data' },
]

interface MoreMenuProps {
  isCollapsed?: boolean;
}

export function MoreMenu({ isCollapsed = false }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 p-0"
      >
        <Settings className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        Mehr
      </Button>
      {isOpen && (
        <Card className="absolute left-full top-0 ml-2 w-64 z-50">
          <CardHeader>
            <CardTitle>Weitere Optionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

