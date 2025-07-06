import { contextEntries } from '../db.js';
import { tasks } from '../db.js';
import { Task } from '../models/task.js';

// Simulate AI processing of a context entry
export const processContext = (req, res) => {
  const { id } = req.params;
  const entry = contextEntries.find(e => e.id === id);
  if (!entry) return res.status(404).json({ error: 'Context entry not found' });

  // Simulate AI logic (copy from frontend ContextProcessor)
  const content = entry.content.toLowerCase();
  const suggestedTasks = [];

  if (content.includes('meeting') || content.includes('call') || content.includes('conference')) {
    suggestedTasks.push({
      title: 'Prepare for upcoming meeting',
      description: 'Review agenda and prepare materials for the meeting mentioned in context',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000),
      category: 'Work',
      contextBased: true,
      tags: ['meeting', 'preparation']
    });
  }
  if (content.includes('follow up') || content.includes('follow-up') || content.includes('remind')) {
    suggestedTasks.push({
      title: 'Follow up on discussion',
      description: 'Send follow-up message or email based on the conversation context',
      priority: 'medium',
      dueDate: new Date(Date.now() + 2 * 86400000),
      category: 'Work',
      contextBased: true,
      tags: ['follow-up', 'communication']
    });
  }
  if (content.includes('buy') || content.includes('purchase') || content.includes('order')) {
    suggestedTasks.push({
      title: 'Purchase items mentioned',
      description: 'Buy the items or services discussed in the context',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 86400000),
      category: 'Personal',
      contextBased: true,
      tags: ['shopping', 'purchase']
    });
  }
  if (content.includes('doctor') || content.includes('appointment') || content.includes('health')) {
    suggestedTasks.push({
      title: 'Schedule health appointment',
      description: 'Book or follow up on health-related appointments mentioned',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000),
      category: 'Health',
      contextBased: true,
      tags: ['health', 'appointment']
    });
  }
  if (content.includes('learn') || content.includes('research') || content.includes('study')) {
    suggestedTasks.push({
      title: 'Research mentioned topic',
      description: 'Look into the topic or subject mentioned in the context',
      priority: 'low',
      dueDate: new Date(Date.now() + 5 * 86400000),
      category: 'Learning',
      contextBased: true,
      tags: ['research', 'learning']
    });
  }
  if (suggestedTasks.length === 0) {
    suggestedTasks.push({
      title: 'Review context and take action',
      description: 'Review the provided context and determine what actions need to be taken',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000),
      category: 'Planning',
      contextBased: true,
      tags: ['review', 'planning']
    });
  }

  // Insights
  const insights = [];
  if (content.includes('urgent') || content.includes('asap') || content.includes('immediately')) {
    insights.push('⚡ Urgent action items detected - prioritize these tasks');
  }
  if (content.includes('deadline') || content.includes('due date') || content.includes('by ')) {
    insights.push('📅 Time-sensitive items found - check for specific deadlines');
  }
  if (content.includes('meeting') || content.includes('call')) {
    insights.push('🤝 Communication activities identified - prepare accordingly');
  }
  if (content.includes('project') || content.includes('work')) {
    insights.push('💼 Work-related content detected - consider task dependencies');
  }
  if (insights.length === 0) {
    insights.push('🔍 Context analyzed - consider breaking down complex activities into smaller tasks');
  }

  entry.processed = true;
  entry.insights = insights.join('. ');

  res.json({
    suggestedTasks: suggestedTasks.slice(0, 3),
    insights: entry.insights
  });
};

// Simulate AI task suggestions based on current tasks
export const getSuggestions = (req, res) => {
  // Copy logic from frontend AITaskSuggestions
  const suggestions = [];
  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))];
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;

  if (!tasks.some(t => t.title.toLowerCase().includes('exercise') || t.title.toLowerCase().includes('workout'))) {
    suggestions.push({
      title: 'Daily Exercise',
      description: 'Schedule 30 minutes of physical activity to maintain health and productivity',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000),
      category: 'Health',
      aiSuggested: true,
      tags: ['health', 'routine']
    });
  }
  if (highPriorityCount > 3) {
    suggestions.push({
      title: 'Review Task Priorities',
      description: 'Reassess high-priority tasks and delegate or reschedule some to maintain balance',
      priority: 'medium',
      dueDate: new Date(),
      category: 'Planning',
      aiSuggested: true,
      tags: ['planning', 'balance']
    });
  }
  if (!tasks.some(t => t.title.toLowerCase().includes('learn') || t.title.toLowerCase().includes('study'))) {
    suggestions.push({
      title: 'Learn Something New',
      description: 'Dedicate time to learning a new skill or improving existing knowledge',
      priority: 'low',
      dueDate: new Date(Date.now() + 3 * 86400000),
      category: 'Learning',
      aiSuggested: true,
      tags: ['learning', 'development']
    });
  }
  if (!tasks.some(t => t.title.toLowerCase().includes('plan') || t.title.toLowerCase().includes('review'))) {
    suggestions.push({
      title: 'Weekly Planning Session',
      description: 'Review completed tasks and plan for the upcoming week',
      priority: 'high',
      dueDate: new Date(Date.now() + (7 - new Date().getDay()) * 86400000),
      category: 'Planning',
      aiSuggested: true,
      tags: ['planning', 'productivity']
    });
  }
  if (!tasks.some(t => t.title.toLowerCase().includes('call') || t.title.toLowerCase().includes('meet'))) {
    suggestions.push({
      title: 'Connect with Friends/Family',
      description: 'Reach out to someone important and maintain social connections',
      priority: 'medium',
      dueDate: new Date(Date.now() + 2 * 86400000),
      category: 'Personal',
      aiSuggested: true,
      tags: ['social', 'relationships']
    });
  }
  if (!tasks.some(t => t.title.toLowerCase().includes('clean') || t.title.toLowerCase().includes('organize'))) {
    suggestions.push({
      title: 'Organize Workspace',
      description: 'Clean and organize your work environment for better productivity',
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000),
      category: 'Personal',
      aiSuggested: true,
      tags: ['organization', 'productivity']
    });
  }

  res.json(suggestions.slice(0, 6));
}; 