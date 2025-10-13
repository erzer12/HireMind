import express from 'express';
import cors from 'cors';
import session from 'express-session';
import resumeRoutes from './routes/resume.js';
import coverLetterRoutes from './routes/coverLetter.js';
import portfolioRoutes from './routes/portfolio.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for storing uploaded resume data
app.use(session({
  secret: process.env.SESSION_SECRET || 'hiremind-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.get('/', (req, res) => {
  res.send('HireMind API Running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HireMind API is running' });
});

app.use('/api/resume', resumeRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HireMind API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
