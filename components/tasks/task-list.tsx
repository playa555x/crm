import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Task } from '@/types/task'

interface TaskListProps {
  tasks: Task[]
  onTaskSelect: (task: Task) => void
}

export function TaskList({ tasks, onTaskSelect }: TaskListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Zugewiesen an</TableHead>
          <TableHead>Fälligkeitsdatum</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id} onClick={() => onTaskSelect(task)} className="cursor-pointer">
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell>{task.dueDate}</TableCell>
            <TableCell>{task.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

