'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

moment.locale('de')
const localizer = momentLocalizer(moment)

interface Appointment {
  id: number
  title: string
  start: Date
  end: Date
  description: string
  employee_id?: number
}

const messages = {
  allDay: 'Ganztägig',
  previous: 'Zurück',
  next: 'Weiter',
  today: 'Heute',
  month: 'Monat',
  week: 'Woche',
  day: 'Tag',
  agenda: 'Agenda',
  date: 'Datum',
  time: 'Uhrzeit',
  event: 'Termin',
  noEventsInRange: 'Keine Termine in diesem Zeitraum.',
  showMore: (total: number) => `+ ${total} weitere`,
  work_week: 'Arbeitswoche',
  yesterday: 'Gestern',
  tomorrow: 'Morgen',
  sunday: 'Sonntag',
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
}

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
  })

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        title: 'Kundentermin',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        description: 'Besprechung mit Kunde XYZ',
        employee_id: 1,
      },
      {
        id: 2,
        title: 'Teammeeting',
        start: new Date(2024, 0, 16, 14, 0),
        end: new Date(2024, 0, 16, 15, 30),
        description: 'Wöchentliches Teammeeting',
      },
    ]
    setAppointments(mockAppointments)
  }

  const handleAddAppointment = () => {
    const id = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1
    setAppointments([...appointments, { id, ...newAppointment }])
    setIsAddAppointmentOpen(false)
    setNewAppointment({
      title: '',
      start: new Date(),
      end: new Date(),
      description: '',
    })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kalender</h2>
        <Button onClick={() => setIsAddAppointmentOpen(true)}>
          Termin hinzufügen
        </Button>
      </div>
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          formats={{
            dateFormat: 'D',
            dayFormat: 'ddd D.M.',
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd, D. MMMM',
            dayRangeHeaderFormat: ({ start, end }, culture, local) =>
              `${local.format(start, 'D. MMMM', culture)} - ${local.format(end, 'D. MMMM', culture)}`,
            weekdayFormat: 'dddd',
          }}
          views={{
            month: true,
            week: true,
            day: true,
            agenda: true,
          }}
        />
      </div>

      <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Termin hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titel
              </Label>
              <Input
                id="title"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Beginn
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={moment(newAppointment.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setNewAppointment({ ...newAppointment, start: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                Ende
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={moment(newAppointment.end).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setNewAppointment({ ...newAppointment, end: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Beschreibung
              </Label>
              <Input
                id="description"
                value={newAppointment.description}
                onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddAppointment}>Termin hinzufügen</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

