
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date | null;
  completed: boolean;
  createdAt: Date;
  category?: string;
  aiSuggested?: boolean;
  contextBased?: boolean;
  priorityScore?: number;
  suggestedDeadline?: Date;
  enhancedDescription?: string;
  tags?: string[];
}

export interface FilterOptions {
  search: string;
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | Priority;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'upcoming';
  category: 'all' | string;
  aiSuggested: boolean;
}

export interface ContextEntry {
  id: string;
  content: string;
  source: 'whatsapp' | 'email' | 'notes' | 'manual';
  timestamp: Date;
  processed: boolean;
  insights?: string;
}

export interface AIInsights {
  suggestedTasks: Partial<Task>[];
  priorityRecommendations: string[];
  deadlineSuggestions: string[];
  categoryRecommendations: string[];
}
