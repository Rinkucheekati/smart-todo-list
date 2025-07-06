# Backend for Simple Todo App

This backend provides RESTful APIs for managing tasks, context entries, and AI-powered suggestions for the Simple Todo frontend.

## Features
- Task CRUD (create, read, update, delete)
- Context entry CRUD
- AI-powered context processing and task suggestions (stubbed for now)

## Structure
- `controllers/` — Route handlers
- `models/` — Data models (in-memory for now)
- `routes/` — Express route definitions
- `services/` — AI and business logic
- `db.js` — In-memory database (can be swapped for real DB)
- `app.js` — Express app entry point

## Setup
```bash
cd backend
npm install
node app.js
```

## API Endpoints
- `GET    /tasks` — List tasks
- `POST   /tasks` — Create task
- `PUT    /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `GET    /contexts` — List context entries
- `POST   /contexts` — Create context entry
- `PUT    /contexts/:id` — Update context entry
- `DELETE /contexts/:id` — Delete context entry
- `POST   /contexts/:id/process` — Process context entry (AI)
- `GET    /ai/suggestions` — Get AI task suggestions 