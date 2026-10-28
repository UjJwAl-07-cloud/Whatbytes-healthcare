import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import mappingRoutes from './routes/mappingRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// ─── Security Headers ─────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// ─── Request Logging ──────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ─────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Health Check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WhatBytes Healthcare API is running.',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/mappings', mappingRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────
app.use(errorHandler);

export default app;
