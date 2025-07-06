
import React, { useState } from 'react';
import { ContextEntry, Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Wand2, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import * as api from '@/lib/api';

interface ContextProcessorProps {
  entries: ContextEntry[];
  onUpdateEntry: (id: string, updatedData: Partial<ContextEntry>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const ContextProcessor: React.FC<ContextProcessorProps> = ({ 
  entries, 
  onUpdateEntry, 
  onAddTask 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<{
    entryId: string;
    suggestedTasks: Omit<Task, 'id' | 'createdAt' | 'completed'>[];
    insights: string;
  }[]>([]);

  const processContextEntry = async (entry: ContextEntry) => {
    setIsProcessing(true);
    const result = await api.processContext(entry.id);
    setProcessedResults(prev => [...prev, {
      entryId: entry.id,
      suggestedTasks: result.suggestedTasks,
      insights: result.insights
    }]);
    onUpdateEntry(entry.id, { processed: true, insights: result.insights });
    setIsProcessing(false);
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    await onAddTask(task);
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Context to Process</h3>
          <p className="text-gray-600">
            Add some context entries first, then come back here to process them with AI.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => {
        const result = processedResults.find(r => r.entryId === entry.id);
        
        return (
          <Card key={entry.id} className="border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Context Processing
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {entry.source}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {format(entry.timestamp, 'MMM dd, HH:mm')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-gray-800 font-medium mb-2">{entry.content}</div>
                {result ? (
                  <>
                    <div className="mb-2">
                      <span className="font-semibold">AI Insights:</span> {result.insights}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Suggested Tasks:</span>
                      <ul className="list-disc ml-6">
                        {result.suggestedTasks.map((task, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="font-semibold">{task.title}</span> — {task.description}
                            <Button size="xs" className="ml-2" onClick={() => handleAddTask(task)}>
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Button onClick={() => processContextEntry(entry)} disabled={isProcessing}>
                    <Wand2 className="h-4 w-4 mr-1" />
                    {isProcessing ? 'Processing...' : 'Process with AI'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
