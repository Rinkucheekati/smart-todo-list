import { tasks } from '../db.js';
import { Task } from '../models/task.js';

export const getTasks = (req, res) => {
  res.json(tasks);
};

export const createTask = (req, res) => {
  const task = new Task(req.body);
  tasks.unshift(task);
  res.status(201).json(task);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  const [removed] = tasks.splice(idx, 1);
  res.json(removed);
}; 