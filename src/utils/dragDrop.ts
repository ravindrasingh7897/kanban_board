import { Task, TaskStatus } from '@/types/kanban';

/**
 * Drag and drop utility functions for handling task movement
 */
export class DragDropUtil {
  /**
   * Handle drag start event
   */
  static handleDragStart(event: React.DragEvent<HTMLDivElement>, taskId: string): void {
    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
  }

  /**
   * Handle drag over event (required for drop to work)
   */
  static handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  /**
   * Handle drop event and return the task ID and new status
   */
  static handleDrop(
    event: React.DragEvent<HTMLDivElement>, 
    newStatus: TaskStatus
  ): { taskId: string; newStatus: TaskStatus } | null {
    event.preventDefault();
    
    const taskId = event.dataTransfer.getData('text/plain');
    if (!taskId) return null;

    return { taskId, newStatus };
  }

  /**
   * Move task to new status
   */
  static moveTask(tasks: Task[], taskId: string, newStatus: TaskStatus): Task[] {
    return tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    );
  }
}