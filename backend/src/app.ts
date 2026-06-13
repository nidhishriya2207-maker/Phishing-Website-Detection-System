import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import scanRouter from './routes/scanRoutes.js';
import blacklistRouter from './routes/blacklistRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests (React app & Chrome Extension)
app.use(cors({
  origin: '*', // Allow all origins for extension and local development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Databasecd backen
connectDB();

// API Endpoints
app.use('/api', scanRouter);
app.use('/api/blacklist', blacklistRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled application error:', err);
  res.status(500).json({ error: 'Internal server error occurred', details: err.message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
