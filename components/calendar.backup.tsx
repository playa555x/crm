import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

export function CalendarView() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Kalender</h2>
      <Calendar />
    </div>
  )
}

