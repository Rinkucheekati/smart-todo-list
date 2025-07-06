
import React, { useState } from 'react';
import { Task } from '@/types/task';
import { TaskItem } from '@/components/TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updatedData: Partial<Task>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tasks found</div>
        <div className="text-gray-500 text-sm">
          Add a new task or adjust your filters to see your todos
        </div>
      </div>
    );
  }

  // Sort tasks: incomplete first, then by priority, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    // Sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally sort by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="space-y-2">
      {sortedTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onUpdate={(updatedData) => onUpdateTask(task.id, updatedData)}
          index={index}
        />
      ))}
    </div>
  );
};
