import { Task } from '@/types/kanban';

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