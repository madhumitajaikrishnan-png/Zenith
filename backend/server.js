import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import progressRoutes from './routes/progress.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

app.listen(3001, () => console.log('✅ Server running on port 3001'));