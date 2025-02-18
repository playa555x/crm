export interface SubTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  subtasks: SubTask[];
}

