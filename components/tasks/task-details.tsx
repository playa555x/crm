import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from '@/types/task'
import { SubtaskManagement } from './subtask-management'
import { Employee } from '@/types/employee'; // Import Employee type

interface TaskDetailsProps {
  task: Task | null
  employees: Employee[]
}

export function TaskDetails({ task, employees }: TaskDetailsProps) {
  if (!task) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Wählen Sie eine Aufgabe aus, um Details anzuzeigen.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Beschreibung</h4>
            <p>{task.description}</p>
          </div>
          <div>
            <h4 className="font-semibold">Zugewiesen an</h4>
            <p>{task.assignee}</p>
          </div>
          <div>
            <h4 className="font-semibold">Fälligkeitsdatum</h4>
            <p>{task.dueDate}</p>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
            <p>{task.status}</p>
          </div>
          <div>
            <h4 className="font-semibold">Unteraufgaben</h4>
            <SubtaskManagement
              subtasks={task.subtasks}
              onSubtasksChange={(newSubtasks) => {
                // Here you would update the task with the new subtasks
                console.log('Subtasks updated:', newSubtasks)
              }}
              employees={employees}
            />
          </div>
          {/* Add more task details here */}
        </div>
      </CardContent>
    </Card>
  )
}

