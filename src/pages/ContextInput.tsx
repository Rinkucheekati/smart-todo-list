
import React, { useState, useEffect } from 'react';
import { ContextForm } from '@/components/ContextForm';
import { ContextHistory } from '@/components/ContextHistory';
import { ContextProcessor } from '@/components/ContextProcessor';
import { ContextEntry, Task } from '@/types/task';
import { MessageSquare, Brain, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import * as api from '@/lib/api';

const ContextInput = () => {
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [contextData, taskData] = await Promise.all([
        api.getContexts(),
        api.getTasks()
      ]);
      const parsedContext = contextData.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setContextEntries(parsedContext);
      const parsedTasks = taskData.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
        suggestedDeadline: task.suggestedDeadline ? new Date(task.suggestedDeadline) : null
      }));
      setTasks(parsedTasks);
      setLoading(false);
    })();
  }, []);

  const addContextEntry = async (entryData: Omit<ContextEntry, 'id' | 'timestamp' | 'processed'>) => {
    const newEntry = await api.createContext(entryData);
    setContextEntries(prev => [
      { ...newEntry, timestamp: new Date(newEntry.timestamp) },
      ...prev
    ]);
  };

  const updateContextEntry = async (id: string, updatedData: Partial<ContextEntry>) => {
    const updated = await api.updateContext(id, updatedData);
    setContextEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updated } : entry));
  };

  const deleteContextEntry = async (id: string) => {
    await api.deleteContext(id);
    setContextEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addTaskFromContext = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask = await api.createTask({ ...taskData, contextBased: true });
    setTasks(prev => [
      { ...newTask, dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null, createdAt: new Date(newTask.createdAt) },
      ...prev
    ]);
  };

  const unprocessedEntries = contextEntries.filter(entry => !entry.processed);
  const processedEntries = contextEntries.filter(entry => entry.processed);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Context Input
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Add daily context data for AI-powered task generation and insights
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-indigo-600">{contextEntries.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unprocessed</p>
                <p className="text-2xl font-bold text-orange-600">{unprocessedEntries.length}</p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-green-600">{processedEntries.length}</p>
              </div>
              <History className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Context Tasks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {tasks.filter(t => t.contextBased).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Input
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Process
            {unprocessedEntries.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {unprocessedEntries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    Add Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContextForm onAddEntry={addContextEntry} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Context Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContextHistory
                    entries={contextEntries.slice(0, 10)}
                    onUpdateEntry={updateContextEntry}
                    onDeleteEntry={deleteContextEntry}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <ContextProcessor
            entries={unprocessedEntries}
            onUpdateEntry={updateContextEntry}
            onAddTask={addTaskFromContext}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ContextHistory
            entries={processedEntries}
            onUpdateEntry={updateContextEntry}
            onDeleteEntry={deleteContextEntry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContextInput;
