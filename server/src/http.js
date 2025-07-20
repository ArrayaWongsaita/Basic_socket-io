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

  // Make io available to routes
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // test io emit
  app.get('/api/test/socket', (req, res) => {
    const { io } = req;
    io.emit('error', { message: 'Hello from HTTP route!' });
    res.json({ message: 'Socket event emitted' });
  });

  // Import routes
  app.use('/api/auth', authModule.routes);

  // Error handling middleware
  app.use(errorHandler);
  app.use(notFoundHandler);
}
