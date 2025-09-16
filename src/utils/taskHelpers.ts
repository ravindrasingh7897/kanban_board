import { Task, TaskStatus } from '@/types/kanban';


export class TaskHelpers {
 
  static generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createTask(title: string, description: string): Task {
    return {
      id: this.generateId(),
      title: title.trim(),
      description: description.trim(),
      status: 'todo' as TaskStatus,
      createdAt: new Date()
    };
  }


  static groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
    return tasks.reduce((groups, task) => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
      return groups;
    }, {} as Record<TaskStatus, Task[]>);
  }

  static validateTask(title: string, description: string): string | null {
    if (!title.trim()) {
      return 'Task title is required';
    }
    if (title.trim().length > 100) {
      return 'Task title must be less than 100 characters';
    }
    if (description.trim().length > 500) {
      return 'Task description must be less than 500 characters';
    }
    return null;
  }
}