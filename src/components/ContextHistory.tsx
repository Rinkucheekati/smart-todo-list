
import React from 'react';
import { ContextEntry } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, FileText, Edit, Trash2, Brain, Check } from 'lucide-react';
import { format } from 'date-fns';

interface ContextHistoryProps {
  entries: ContextEntry[];
  onUpdateEntry: (id: string, updatedData: Partial<ContextEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export const ContextHistory: React.FC<ContextHistoryProps> = ({ 
  entries, 
  onUpdateEntry, 
  onDeleteEntry 
}) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'notes': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'manual': return <Edit className="h-4 w-4 text-gray-600" />;
      default: return <Edit className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'whatsapp': return 'bg-green-100 text-green-800 border-green-200';
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'notes': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manual': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkProcessed = (id: string) => {
    onUpdateEntry(id, { processed: true });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No context entries found</div>
        <div className="text-gray-500 text-sm">
          Add context data to get AI-powered task suggestions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className={`${entry.processed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  {getSourceIcon(entry.source)}
                  <Badge variant="outline" className={getSourceColor(entry.source)}>
                    {entry.source.charAt(0).toUpperCase() + entry.source.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {format(entry.timestamp, 'MMM dd, yyyy HH:mm')}
                  </span>
                  {entry.processed && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Processed
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-900">
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>

                {entry.insights && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">AI Insights</span>
                    </div>
                    <p className="text-sm text-purple-700">{entry.insights}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {!entry.processed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleMarkProcessed(entry.id)}
                    title="Mark as processed"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteEntry(entry.id)}
                  title="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
