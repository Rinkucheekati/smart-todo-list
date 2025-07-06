
import React, { useState, useEffect } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskFilters } from '@/components/TaskFilters';
import { AITaskSuggestions } from '@/components/AITaskSuggestions';
import { Task, FilterOptions } from '@/types/task';
import { CheckSquare, Plus, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as api from '@/lib/api';

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    priority: 'all',
    dueDateFilter: 'all',
    category: 'all',
    aiSuggested: false
  });
  const [loading, setLoading] = useState(true);

  // Load tasks from backend
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await api.getTasks();
      // Convert date strings to Date objects
      const parsedTasks = data.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
        suggestedDeadline: task.suggestedDeadline ? new Date(task.suggestedDeadline) : null
      }));
      setTasks(parsedTasks);
      setLoading(false);
    })();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask = await api.createTask(taskData);
    setTasks(prev => [
      { ...newTask, dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null, createdAt: new Date(newTask.createdAt) },
      ...prev
    ]);
  };

  const addAITask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask = await api.createTask({ ...taskData, aiSuggested: true });
    setTasks(prev => [
      { ...newTask, dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null, createdAt: new Date(newTask.createdAt) },
      ...prev
    ]);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = await api.updateTask(id, { completed: !task.completed });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: updated.completed } : t));
  };

  const deleteTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = async (id: string, updatedData: Partial<Task>) => {
    const updated = await api.updateTask(id, updatedData);
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updated } : task));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'completed' && task.completed) ||
                         (filters.status === 'pending' && !task.completed);
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesDueDate = filters.dueDateFilter === 'all' || 
                          (filters.dueDateFilter === 'overdue' && task.dueDate && task.dueDate < new Date() && !task.completed) ||
                          (filters.dueDateFilter === 'today' && task.dueDate && 
                           task.dueDate.toDateString() === new Date().toDateString()) ||
                          (filters.dueDateFilter === 'upcoming' && task.dueDate && task.dueDate > new Date());
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesAI = !filters.aiSuggested || task.aiSuggested;
    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate && matchesCategory && matchesAI;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Task Management
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create, organize, and manage your tasks with AI assistance
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-lg text-gray-500">Loading tasks...</div>
      ) : (
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="ai-suggestions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Suggestions
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-indigo-600" />
                      Add New Task
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskForm onAddTask={addTask} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <TaskFilters filters={filters} onFiltersChange={setFilters} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tasks ({filteredTasks.slice(0, 10).length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList
                      tasks={filteredTasks.slice(0, 10)}
                      onToggleTask={toggleTask}
                      onDeleteTask={deleteTask}
                      onUpdateTask={updateTask}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-suggestions" className="space-y-6">
            <AITaskSuggestions tasks={tasks} onAddTask={addAITask} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <TaskFilters filters={filters} onFiltersChange={setFilters} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onUpdateTask={updateTask}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TaskManagement;
