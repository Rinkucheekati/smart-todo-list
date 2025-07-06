const BASE_URL = 'http://localhost:4000';

// --- Task APIs ---
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  return res.json();
}

// --- Context APIs ---
export async function getContexts() {
  const res = await fetch(`${BASE_URL}/contexts`);
  return res.json();
}

export async function createContext(entry) {
  const res = await fetch(`${BASE_URL}/contexts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return res.json();
}

export async function updateContext(id, updates) {
  const res = await fetch(`${BASE_URL}/contexts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deleteContext(id) {
  const res = await fetch(`${BASE_URL}/contexts/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function processContext(id) {
  const res = await fetch(`${BASE_URL}/contexts/${id}/process`, { method: 'POST' });
  return res.json();
}

// --- AI Suggestions ---
export async function getAISuggestions() {
  const res = await fetch(`${BASE_URL}/ai/suggestions`);
  return res.json();
} 