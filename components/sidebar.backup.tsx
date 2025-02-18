import { LayoutDashboard, DollarSign, Users, Mail, Calendar, Users2, Grid, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: DollarSign, label: 'Geschäfte', view: 'deals' },
  { icon: Users, label: 'Kontakte', view: 'contacts' },
  { icon: Mail, label: 'E-Mail', view: 'email' },
  { icon: Calendar, label: 'Kalender', view: 'calendar' },
  { icon: Users2, label: 'Mitarbeiter', view: 'employees' },
  { icon: Grid, label: 'Apps', view: 'apps' },
  { icon: MoreHorizontal, label: 'Mehr', view: 'more' },
]

interface SidebarProps {
  setActiveView: (view: string) => void
}

export function Sidebar({ setActiveView }: SidebarProps) {
  return (
    <TooltipProvider>
      <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        {sidebarItems.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-full"
                onClick={() => setActiveView(item.view)}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </aside>
    </TooltipProvider>
  )
}

