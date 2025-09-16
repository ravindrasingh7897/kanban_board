import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { DragDropUtil } from "@/utils/dragDrop";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
}

/**
 * Kanban column component that handles drag and drop operations
 */
export const KanbanColumn = ({ status, title, tasks, onTaskDrop }: KanbanColumnProps) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    DragDropUtil.handleDragOver(event);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const result = DragDropUtil.handleDrop(event, status);
    if (result) {
      onTaskDrop(result.taskId, result.newStatus);
    }
  };

  const getColumnTheme = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return {
          headerBg: 'bg-secondary/30',
          borderColor: 'border-secondary',
          badgeVariant: 'secondary' as const
        };
      case 'inprogress':
        return {
          headerBg: 'bg-primary/10',
          borderColor: 'border-primary/20',
          badgeVariant: 'default' as const
        };
      case 'done':
        return {
          headerBg: 'bg-accent/30',
          borderColor: 'border-accent',
          badgeVariant: 'outline' as const
        };
    }
  };

  const theme = getColumnTheme(status);

  return (
    <Card 
      className={`h-full flex flex-col ${theme.borderColor} bg-card/30 backdrop-blur-sm`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className={`pb-4 ${theme.headerBg} rounded-t-lg border-b border-border/50`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            {title}
          </CardTitle>
          <Badge variant={theme.badgeVariant} className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <div className="space-y-3 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-border/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Drop tasks here
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};