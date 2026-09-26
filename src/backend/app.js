import express from 'express';
import cors from 'cors';
import { initDatabase } from './utils/dbInit.js';
import { seedInitialData } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

const app = express();

let isInitialized = false;
export async function ensureDbInitialized() {
  if (!isInitialized) {
    try {
      await initDatabase();
      await seedInitialData();
      isInitialized = true;
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }
}

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await ensureDbInitialized();
  next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TeamFlow Next.js API', timestamp: new Date().toISOString() });
});

export default app;
