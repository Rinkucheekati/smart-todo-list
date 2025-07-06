
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task, Priority } from '@/types/task';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      category: category.trim() || undefined
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(null);
    setCategory('');
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Task description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none"
          rows={3}
        />
      </div>

      <div>
        <Input
          placeholder="Category (optional)..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
            <SelectTrigger className={cn("w-full", getPriorityColor(priority))}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low" className="text-green-600">
                🟢 Low Priority
              </SelectItem>
              <SelectItem value="medium" className="text-orange-600">
                🟡 Medium Priority
              </SelectItem>
              <SelectItem value="high" className="text-red-600">
                🔴 High Priority
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "MMM dd, yyyy") : "Due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate || undefined}
                onSelect={(date) => setDueDate(date || null)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </form>
  );
};
