import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Task } from '@/types/task'
import { Card, CardContent } from "@/components/ui/card"

interface TaskBoardProps {
  tasks: Task[]
  onTaskSelect: (task: Task) => void
}

export function TaskBoard({ tasks, onTaskSelect }: TaskBoardProps) {
  const columns = ['To Do', 'In Progress', 'Done']

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex gap-4">
        {columns.map((column) => (
          <div key={column} className="flex-1">
            <h3 className="font-semibold mb-2">{column}</h3>
            <Droppable droppableId={column}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-secondary p-4 rounded-lg min-h-[200px]"
                >
                  {tasks
                    .filter((task) => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 cursor-pointer"
                            onClick={() => onTaskSelect(task)}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {task.assignee} - {task.dueDate}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

