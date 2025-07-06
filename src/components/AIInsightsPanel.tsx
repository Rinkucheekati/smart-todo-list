
import React from 'react';
import { Task, ContextEntry } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Calendar, Target } from 'lucide-react';

interface AIInsightsPanelProps {
  tasks: Task[];
  contextEntries: ContextEntry[];
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ tasks, contextEntries }) => {
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = pendingTasks.filter(t => t.dueDate && t.dueDate < new Date());
  const todayTasks = pendingTasks.filter(t => t.dueDate && 
    t.dueDate.toDateString() === new Date().toDateString());

  const generateInsights = () => {
    const insights = [];

    // Productivity insights
    if (completedTasks.length > 0) {
      const completionRate = (completedTasks.length / tasks.length) * 100;
      insights.push({
        type: 'productivity',
        message: `You have a ${completionRate.toFixed(1)}% task completion rate`,
        priority: completionRate > 70 ? 'positive' : completionRate > 40 ? 'neutral' : 'negative'
      });
    }

    // Priority balance
    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 5) {
      insights.push({
        type: 'priority',
        message: `You have ${highPriorityTasks.length} high-priority tasks. Consider breaking them down.`,
        priority: 'warning'
      });
    }

    // Deadline management
    if (overdueTasks.length > 0) {
      insights.push({
        type: 'deadline',
        message: `${overdueTasks.length} tasks are overdue. Review and reschedule if needed.`,
        priority: 'negative'
      });
    }

    if (todayTasks.length > 0) {
      insights.push({
        type: 'today',
        message: `${todayTasks.length} tasks are due today. Focus on completing these first.`,
        priority: 'warning'
      });
    }

    // Context analysis
    const recentContext = contextEntries.filter(e => 
      Date.now() - e.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );
    if (recentContext.length > 0) {
      insights.push({
        type: 'context',
        message: `${recentContext.length} context entries this week. AI can suggest relevant tasks.`,
        priority: 'positive'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'productivity': return <TrendingUp className="h-4 w-4" />;
      case 'priority': return <Target className="h-4 w-4" />;
      case 'deadline': return <Calendar className="h-4 w-4" />;
      case 'today': return <Calendar className="h-4 w-4" />;
      case 'context': return <Brain className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.priority)}`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{insight.message}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add more tasks and context entries to get AI insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
