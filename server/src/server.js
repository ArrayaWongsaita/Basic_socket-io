import { createServer } from 'http';
import express from 'express';

import { Server as SocketIOServer } from 'socket.io';

import envConfig from './shared/config/env.config.js';
import registerHttpRoutes from './http.js';
import registerWebSocket from './webSocket.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
  },
  //   pingInterval: 30000,  // 30s
  //   pingTimeout: 30000,   // 30s
});

//  Register HTTP routes
registerHttpRoutes(app, io);

// Register WebSocket routes
registerWebSocket(io);

httpServer.listen(envConfig.PORT, () => {
  console.log(`Server ready at http://localhost:${envConfig.PORT}`);
});
