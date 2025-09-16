import { Task } from '@/types/kanban';

const STORAGE_KEY = 'kanban_tasks';

/**
 * Storage utility for persisting tasks to localStorage
 */
export class StorageUtil {
  /**
   * Load tasks from localStorage
   */
  static loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const tasks = JSON.parse(stored);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  }

  /**
   * Save tasks to localStorage
   */
  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  /**
   * Clear all tasks from storage
   */
  static clearTasks(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks from storage:', error);
    }
  }
}