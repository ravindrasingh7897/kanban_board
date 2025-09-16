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