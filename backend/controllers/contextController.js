import { contextEntries } from '../db.js';
import { ContextEntry } from '../models/contextEntry.js';

export const getContexts = (req, res) => {
  res.json(contextEntries);
};

export const createContext = (req, res) => {
  const entry = new ContextEntry(req.body);
  contextEntries.unshift(entry);
  res.status(201).json(entry);
};

export const updateContext = (req, res) => {
  const { id } = req.params;
  const idx = contextEntries.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Context entry not found' });
  contextEntries[idx] = { ...contextEntries[idx], ...req.body };
  res.json(contextEntries[idx]);
};

export const deleteContext = (req, res) => {
  const { id } = req.params;
  const idx = contextEntries.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Context entry not found' });
  const [removed] = contextEntries.splice(idx, 1);
  res.json(removed);
}; 