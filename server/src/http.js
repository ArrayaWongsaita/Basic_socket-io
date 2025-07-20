import express from 'express';
import morgan from 'morgan';
import authModule from './modules/auth/index.js';
import cors from 'cors';
import { errorHandler } from './shared/middleware/error.middleware.js';
import { notFoundHandler } from './shared/middleware/not-found.middleware.js';

export default function registerHttpRoutes(app, io) {
  app.use(express.json());
  app.use(cors());
  // app.use(morgan('dev'));

  // Import routes
  app.use('/api/auth', authModule.routes);

  // Error handling middleware
  app.use(errorHandler);
  app.use(notFoundHandler);
}
