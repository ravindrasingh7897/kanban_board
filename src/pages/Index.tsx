import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/kanban";
import { StorageUtil } from "@/utils/storage";
import { TaskHelpers } from "@/utils/taskHelpers";
import { TaskForm } from "@/components/TaskForm";
import { KanbanColumn } from "@/components/KanbanColumn";
import { useToast } from "@/hooks/use-toast";
import { Trello, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Main Kanban Board Component
 * Handles task management, persistence, and drag & drop operations
 */
const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = StorageUtil.loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      StorageUtil.saveTasks(tasks);
    }
  }, [tasks]);

  /**
   * Handle creating a new task
   */
  const handleTaskCreate = (title: string, description: string) => {
    const newTask = TaskHelpers.createTask(title, description);
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  /**
   * Handle moving a task between columns
   */
  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      // Show success feedback
      const task = prevTasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        toast({
          title: "Task Moved",
          description: `"${task.title}" moved to ${newStatus === 'todo' ? 'To Do' : newStatus === 'inprogress' ? 'In Progress' : 'Done'}`,
        });
      }
      
      return updatedTasks;
    });
  };

  /**
   * Clear all tasks (for demo purposes)
   */
  const handleClearTasks = () => {
    setTasks([]);
    StorageUtil.clearTasks();
    toast({
      title: "Board Cleared",
      description: "All tasks have been removed from the board.",
    });
  };

  // Group tasks by status for column display
  const groupedTasks = TaskHelpers.groupTasksByStatus(tasks);

  // Column definitions
  const columns = [
    { id: 'todo' as TaskStatus, title: 'To Do', tasks: groupedTasks.todo || [] },
    { id: 'inprogress' as TaskStatus, title: 'In Progress', tasks: groupedTasks.inprogress || [] },
    { id: 'done' as TaskStatus, title: 'Done', tasks: groupedTasks.done || [] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trello className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dynamic Kanban Board
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organize your tasks efficiently with drag-and-drop functionality. 
            Your progress is automatically saved locally.
          </p>
          
          {tasks.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearTasks}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Board
              </Button>
            </div>
          )}
        </header>

        {/* Task Creation Form */}
        <TaskForm onTaskCreate={handleTaskCreate} />

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              status={column.id}
              title={column.title}
              tasks={column.tasks}
              onTaskDrop={handleTaskDrop}
            />
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <Trello className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground">
              Create your first task using the form above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
