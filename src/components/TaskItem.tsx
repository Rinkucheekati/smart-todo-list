
import React, { useState } from 'react';
import { Task, Priority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Edit3, CalendarIcon, Clock, Tag } from 'lucide-react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updatedData: Partial<Task>) => void;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onUpdate,
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState<Date | null>(task.dueDate);
  const [editCategory, setEditCategory] = useState(task.category || '');

  const handleSaveEdit = () => {
    onUpdate({
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate,
      category: editCategory.trim() || undefined
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
    setEditCategory(task.category || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityBorder = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
    }
  };

  const getDueDateStatus = (dueDate: Date | null, completed: boolean) => {
    if (!dueDate || completed) return null;
    
    if (isPast(dueDate) && !isToday(dueDate)) {
      return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
    }
    if (isToday(dueDate)) {
      return { text: 'Due today', color: 'text-orange-600 bg-orange-50' };
    }
    return { text: format(dueDate, 'MMM dd'), color: 'text-blue-600 bg-blue-50' };
  };

  const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);

  return (
    <div 
      className={cn(
        "group p-4 rounded-lg border-l-4 bg-white border border-gray-200 hover:shadow-md transition-all duration-200",
        getPriorityBorder(task.priority),
        task.completed && "opacity-60 bg-gray-50"
      )}
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.3s ease-out forwards'
      }}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-2",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority} priority
                </Badge>
                
                {task.category && (
                  <Badge variant="outline" className="text-purple-700 bg-purple-50">
                    <Tag className="w-3 h-3 mr-1" />
                    {task.category}
                  </Badge>
                )}
                
                {dueDateStatus && (
                  <Badge variant="outline" className={dueDateStatus.color}>
                    <Clock className="w-3 h-3 mr-1" />
                    {dueDateStatus.text}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Task title..."
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Task description..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                    />
                    <Input
                      placeholder="Category..."
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={editPriority} onValueChange={(value: Priority) => setEditPriority(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editDueDate ? format(editDueDate, "MMM dd") : "Due date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editDueDate || undefined}
                            onSelect={(date) => setEditDueDate(date || null)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveEdit} className="flex-1">
                        Save Changes
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
