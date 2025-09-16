import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/kanban";
import { StorageUtil, TaskHelpers } from "@/utils/utils";
import { TaskForm } from "@/components/TaskForm";
import { KanbanColumn } from "@/components/KanbanColumn";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = StorageUtil.loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      StorageUtil.saveTasks(tasks);
    }
  }, [tasks]);

  const handleTaskCreate = (title: string, description: string) => {
    const newTask = TaskHelpers.createTask(title, description);
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      
      return updatedTasks;
    });
  };

  const handleClearTasks = () => {
    setTasks([]);
    StorageUtil.clearTasks();
  };

  const groupedTasks = TaskHelpers.groupTasksByStatus(tasks);

  const columns = [
    { id: 'todo' as TaskStatus, title: 'To Do', tasks: groupedTasks.todo || [] },
    { id: 'inprogress' as TaskStatus, title: 'In Progress', tasks: groupedTasks.inprogress || [] },
    { id: 'done' as TaskStatus, title: 'Done', tasks: groupedTasks.done || [] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
               Kanban Board
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organize tasks efficiently
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

        <TaskForm onTaskCreate={handleTaskCreate} />

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

      </div>
    </div>
  );
};

export default Index;
