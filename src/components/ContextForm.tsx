
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageSquare, Mail, FileText, Edit } from 'lucide-react';
import { ContextEntry } from '@/types/task';

interface ContextFormProps {
  onAddEntry: (entry: Omit<ContextEntry, 'id' | 'timestamp' | 'processed'>) => void;
}

export const ContextForm: React.FC<ContextFormProps> = ({ onAddEntry }) => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState<'whatsapp' | 'email' | 'notes' | 'manual'>('manual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    onAddEntry({
      content: content.trim(),
      source
    });

    // Reset form
    setContent('');
    setSource('manual');
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'notes': return <FileText className="h-4 w-4" />;
      case 'manual': return <Edit className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return 'text-green-600 bg-green-50 border-green-200';
      case 'email': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'notes': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'manual': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Content Source</label>
        <Select value={source} onValueChange={(value: any) => setSource(value)}>
          <SelectTrigger className={getSourceColor(source)}>
            <div className="flex items-center gap-2">
              {getSourceIcon(source)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whatsapp" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                WhatsApp Messages
              </div>
            </SelectItem>
            <SelectItem value="email" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Content
              </div>
            </SelectItem>
            <SelectItem value="notes" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                Personal Notes
              </div>
            </SelectItem>
            <SelectItem value="manual" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-gray-600" />
                Manual Input
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Context Content</label>
        <Textarea
          placeholder="Paste or type your daily context here (messages, emails, notes, thoughts)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-none min-h-[120px]"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This information will be analyzed by AI to suggest relevant tasks and insights.
        </p>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Context Entry
      </Button>
    </form>
  );
};
