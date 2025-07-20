import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configApp } from '../../http.js';
import { configSocketIO } from '../../io.js';

// Initialize
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite dev server
    methods: ['GET', 'POST'],
  },
});

// configure
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

configApp(app);
configSocketIO(io);
// io.on('connection', (socket) => {
//   console.log('🔌 New client connected:', socket.id);
// });

export { app, server, io };
