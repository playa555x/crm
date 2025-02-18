'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/auth-context'

interface Task {
  id: number
  title: string
  due_date: string
  employee_id: number
  status: 'open' | 'in_progress' | 'completed'
}

export function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    due_date: '',
    employee_id: user?.id || 0,
    status: 'open',
  })

  useEffect(() => {
    // Load tasks from the "Aufgaben" table
    loadTasks()
  }, [])

  const loadTasks = async () => {
    // This would be an API call in a real application
    // For now, we'll use mock data
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Kundenpräsentation vorbereiten',
        due_date: '2024-01-20',
        employee_id: 1,
        status: 'in_progress',
      },
      {
        id: 2,
        title: 'Projektbericht erstellen',
        due_date: '2024-01-25',
        employee_id: 1,
        status: 'open',
      },
    ]
    setTasks(mockTasks)
  }

  const handleAddTask = () => {
    const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
    setTasks([...tasks, { id, ...newTask }])
    setIsAddTaskOpen(false)
    setNewTask({
      title: '',
      due_date: '',
      employee_id: user?.id || 0,
      status: 'open',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aufgaben</h2>
        <Button onClick={() => setIsAddTaskOpen(true)}>
          Aufgabe hinzufügen
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Fälligkeitsdatum</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.due_date}</TableCell>
              <TableCell>{task.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Aufgabe hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titel
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due_date" className="text-right">
                Fälligkeitsdatum
              </Label>
              <Input
                id="due_date"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value as Task['status'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Status auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Offen</SelectItem>
                  <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddTask}>Aufgabe hinzufügen</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

