export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  createdAt: Date;
}

export type TaskStatus = Task['status'];

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}