import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from '@/types/task'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Employee } from '@/types/employee'
import { getEmployees } from '@/utils/employeeData'

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreate: (task: Task) => void
}

export function NewTaskDialog({ open, onOpenChange, onTaskCreate }: NewTaskDialogProps) {
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'To Do',
    subtasks: [],
  })
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    getEmployees().then(setEmployees)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onTaskCreate({ ...newTask, id: Date.now().toString() })
    onOpenChange(false)
    setNewTask({ title: '', description: '', assignee: '', dueDate: '', status: 'To Do', subtasks: [] })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="assignee">Zugewiesen an</Label>
            <Select
              value={newTask.assignee}
              onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mitarbeiter auswählen" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newTask.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP", { locale: de }) : <span>Datum auswählen</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                  onSelect={(date) => setNewTask({ ...newTask, dueDate: date ? date.toISOString() : '' })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={newTask.status}
              onValueChange={(value) => setNewTask({ ...newTask, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Aufgabe erstellen</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

