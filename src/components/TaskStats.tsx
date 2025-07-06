
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Task } from '@/types/task';
import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Priority distribution
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  // Overdue tasks
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate < new Date()
  ).length;

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
  ];

  // Bar chart data
  const barData = [
    { name: 'High', value: priorityStats.high, color: '#ef4444' },
    { name: 'Medium', value: priorityStats.medium, color: '#f59e0b' },
    { name: 'Low', value: priorityStats.low, color: '#10b981' },
  ];

  const COLORS = {
    completed: '#10b981',
    pending: '#f59e0b',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Completion Rate Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 mb-2">{completionRate}%</div>
          <Progress value={completionRate} className="mb-2" />
          <p className="text-xs text-green-700">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Pending Tasks Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{pendingTasks}</div>
          <p className="text-xs text-orange-700 mt-2">
            Tasks remaining to complete
          </p>
        </CardContent>
      </Card>

      {/* Overdue Tasks Card */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">Overdue Tasks</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{overdueTasks}</div>
          <p className="text-xs text-red-700 mt-2">
            Tasks past their due date
          </p>
        </CardContent>
      </Card>

      {/* Priority Distribution Chart */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Priority Mix</CardTitle>
          <BarChart3 className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="h-16 w-full">
            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={25}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-purple-600 text-sm">
                No data
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-purple-700 mt-2">
            <span>🔴 {priorityStats.high}</span>
            <span>🟡 {priorityStats.medium}</span>
            <span>🟢 {priorityStats.low}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
