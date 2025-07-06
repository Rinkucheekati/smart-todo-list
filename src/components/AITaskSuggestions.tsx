
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import * as api from '@/lib/api';

interface AITaskSuggestionsProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const AITaskSuggestions: React.FC<AITaskSuggestionsProps> = ({ tasks, onAddTask }) => {
  const [suggestions, setSuggestions] = useState<Omit<Task, 'id' | 'createdAt' | 'completed'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    const data = await api.getAISuggestions();
    setSuggestions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Task Suggestions
            </CardTitle>
            <Button 
              onClick={fetchSuggestions}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Generating...' : 'Refresh Suggestions'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Based on your current tasks and patterns, here are some AI-generated suggestions to improve your productivity and well-being.
          </p>

          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-2 border-dashed border-purple-200 bg-purple-50/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {suggestion.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(suggestion.dueDate), 'MMM dd')}
                          </div>
                        )}
                        {suggestion.category && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {suggestion.category}
                          </div>
                        )}
                      </div>

                      {suggestion.tags && (
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => onAddTask(suggestion)}
                        size="sm" 
                        className="w-full mt-3"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No suggestions available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
