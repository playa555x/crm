'use client'

import { useState, useEffect } from 'react'
import { TaskList } from './task-list'
import { TaskBoard } from './task-board'
import { TaskDetails } from './task-details'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { NewTaskDialog } from './new-task-dialog'
import { Task } from '@/types/task'
import AppointmentCalendar from '@/components/calendar'
import { Employee } from '@/types/employee'
import { getEmployees } from '@/utils/employeeData'

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list')
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    getEmployees().then(setEmployees)
  }, [])

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aufgaben</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            Liste
          </Button>
          <Button
            variant={viewMode === 'board' ? 'default' : 'outline'}
            onClick={() => setViewMode('board')}
          >
            Board
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Kalender
          </Button>
          <Button onClick={() => setIsNewTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Neue Aufgabe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          {viewMode === 'list' ? (
            <TaskList tasks={tasks} onTaskSelect={setSelectedTask} />
          ) : viewMode === 'board' ? (
            <TaskBoard tasks={tasks} onTaskSelect={setSelectedTask} />
          ) : (
            <AppointmentCalendar tasks={tasks} />
          )}
        </div>
        <div className="col-span-4">
          <TaskDetails task={selectedTask} employees={employees} />
        </div>
      </div>

      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onTaskCreate={addTask}
        employees={employees}
      />
    </div>
  )
}

