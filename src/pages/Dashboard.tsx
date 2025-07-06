
import React, { useState, useEffect } from 'react';
import { TaskStats } from '@/components/TaskStats';
import { TaskList } from '@/components/TaskList';
import { TaskFilters } from '@/components/TaskFilters';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { Task, FilterOptions, ContextEntry } from '@/types/task';
import { CheckSquare, Brain, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    priority: 'all',
    dueDateFilter: 'all',
    category: 'all',
    aiSuggested: false
  });

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('smartTodoTasks');
    const savedContext = localStorage.getItem('smartTodoContext');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
        suggestedDeadline: task.suggestedDeadline ? new Date(task.suggestedDeadline) : null
      }));
      setTasks(parsedTasks);
    }

    if (savedContext) {
      const parsedContext = JSON.parse(savedContext).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setContextEntries(parsedContext);
    }
  }, []);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedData } : task
    ));
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

  const recentTasks = filteredTasks.slice(0, 5);
  const aiSuggestedTasks = tasks.filter(task => task.aiSuggested);
  const contextBasedTasks = tasks.filter(task => task.contextBased);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered task management and insights
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <TaskStats tasks={tasks} />
      </div>

      {/* AI Insights Panel */}
      <div className="mb-8">
        <AIInsightsPanel tasks={tasks} contextEntries={contextEntries} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Suggested Tasks</span>
                <span className="font-bold text-purple-600">{aiSuggestedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Context-Based Tasks</span>
                <span className="font-bold text-blue-600">{contextBasedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Context Entries</span>
                <span className="font-bold text-green-600">{contextEntries.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['high', 'medium', 'low'].map(priority => {
                  const count = tasks.filter(t => t.priority === priority && !t.completed).length;
                  const percentage = tasks.length > 0 ? (count / tasks.filter(t => !t.completed).length) * 100 : 0;
                  return (
                    <div key={priority} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{priority} Priority</span>
                        <span>{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            priority === 'high' ? 'bg-red-500' : 
                            priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tasks and Filters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <TaskFilters filters={filters} onFiltersChange={setFilters} />
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Recent Tasks ({recentTasks.length})
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/tasks'}>
                  View All Tasks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={recentTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
