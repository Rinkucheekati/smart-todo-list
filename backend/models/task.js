import { v4 as uuidv4 } from 'uuid';

export class Task {
  constructor({
    title,
    description = '',
    priority = 'medium',
    dueDate = null,
    category = undefined,
    aiSuggested = false,
    contextBased = false,
    priorityScore = undefined,
    suggestedDeadline = undefined,
    enhancedDescription = undefined,
    tags = []
  }) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.completed = false;
    this.createdAt = new Date();
    this.category = category;
    this.aiSuggested = aiSuggested;
    this.contextBased = contextBased;
    this.priorityScore = priorityScore;
    this.suggestedDeadline = suggestedDeadline ? new Date(suggestedDeadline) : undefined;
    this.enhancedDescription = enhancedDescription;
    this.tags = tags;
  }
} 