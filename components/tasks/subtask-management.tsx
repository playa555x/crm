import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubTask } from '@/types/task'
import { Plus, Trash2 } from 'lucide-react'
import { Employee } from '@/types/employee'
import { getEmployees } from '@/utils/employeeData'

interface SubtaskManagementProps {
  subtasks: SubTask[]
  onSubtasksChange: (subtasks: SubTask[]) => void
  employees: Employee[]
}

export function SubtaskManagement({ subtasks, onSubtasksChange, employees }: SubtaskManagementProps) {
  const [newSubtask, setNewSubtask] = useState<Omit<SubTask, 'id'>>({
    title: '',
    assignee: '',
    dueDate: '',
    status: 'To Do',
  })

  const addSubtask = () => {
    const subtask: SubTask = { ...newSubtask, id: Date.now().toString() }
    onSubtasksChange([...subtasks, subtask])
    setNewSubtask({ title: '', assignee: '', dueDate: '', status: 'To Do' })
  }

  const removeSubtask = (id: string) => {
    onSubtasksChange(subtasks.filter(subtask => subtask.id !== id))
  }

  const updateSubtask = (id: string, field: keyof SubTask, value: string) => {
    onSubtasksChange(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, [field]: value } : subtask
    ))
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Unteraufgaben</h3>
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2">
          <Input
            value={subtask.title}
            onChange={(e) => updateSubtask(subtask.id, 'title', e.target.value)}
            placeholder="Titel"
          />
          <Select
            value={subtask.assignee}
            onValueChange={(value) => updateSubtask(subtask.id, 'assignee', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zuweisen" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {`${employee.firstName} ${employee.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={subtask.dueDate}
            onChange={(e) => updateSubtask(subtask.id, 'dueDate', e.target.value)}
          />
          <Select
            value={subtask.status}
            onValueChange={(value) => updateSubtask(subtask.id, 'status', value as SubTask['status'])}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => removeSubtask(subtask.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={newSubtask.title}
          onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
          placeholder="Neue Unteraufgabe"
        />
        <Button onClick={addSubtask}>
          <Plus className="mr-2 h-4 w-4" /> Hinzufügen
        </Button>
      </div>
    </div>
  )
}

