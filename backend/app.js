import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes.js';
import contextRoutes from './routes/contextRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', taskRoutes);
app.use('/contexts', contextRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Simple Todo Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 