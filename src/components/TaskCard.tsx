import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/kanban";
import { DragDropUtil } from "@/utils/dragDrop";
import { GripVertical, Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

/**
 * Individual task card component with drag functionality
 */
export const TaskCard = ({ task }: TaskCardProps) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    DragDropUtil.handleDragStart(event, task.id);
  };

  const getStatusStyling = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return {
          cardClasses: 'bg-todo border-todo-border hover:bg-todo/80',
          badgeVariant: 'secondary' as const,
          titleColor: 'text-todo-foreground group-hover:text-foreground'
        };
      case 'inprogress':
        return {
          cardClasses: 'bg-inprogress border-inprogress-border hover:bg-inprogress/80',
          badgeVariant: 'default' as const,
          titleColor: 'text-inprogress-foreground group-hover:text-foreground'
        };
      case 'done':
        return {
          cardClasses: 'bg-done border-done-border hover:bg-done/80',
          badgeVariant: 'outline' as const,
          titleColor: 'text-done-foreground group-hover:text-foreground'
        };
      default:
        return {
          cardClasses: 'bg-card/50 border-border/50 hover:border-border',
          badgeVariant: 'secondary' as const,
          titleColor: 'text-card-foreground group-hover:text-foreground'
        };
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const styling = getStatusStyling(task.status);

  return (
    <Card 
      draggable
      onDragStart={handleDragStart}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group backdrop-blur-sm ${styling.cardClasses}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={`text-sm font-medium line-clamp-2 transition-colors ${styling.titleColor}`}>
            {task.title}
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <CardDescription className="text-xs text-muted-foreground line-clamp-3">
            {task.description}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between">
          <Badge variant={styling.badgeVariant} className="text-xs">
            {task.status === 'todo' ? 'To Do' : 
             task.status === 'inprogress' ? 'In Progress' : 'Done'}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};