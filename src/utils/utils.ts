import { Task, TaskStatus } from '@/types/kanban';
export class DragDropUtil {
  static handleDragStart(event: React.DragEvent<HTMLDivElement>, taskId: string): void {
    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
  }
  static handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
  static handleDrop(
    event: React.DragEvent<HTMLDivElement>, 
    newStatus: TaskStatus
  ): { taskId: string; newStatus: TaskStatus } | null {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    if (!taskId) return null;
    return { taskId, newStatus };
  }
  static moveTask(tasks: Task[], taskId: string, newStatus: TaskStatus): Task[] {
    return tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    );
  }
}

const STORAGE_KEY = 'kanban_tasks';
export class StorageUtil {
  static loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  }
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }
  static clearTasks(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks from storage:', error);
    }
  }
}

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
