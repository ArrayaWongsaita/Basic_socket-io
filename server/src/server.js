import { createServer } from 'http';
import express from 'express';

import envConfig from './shared/config/env.config.js';
import registerHttpRoutes from './http.js';
import registerWebSocket from './webSocket.js';

const app = express();

//  Register HTTP routes
registerHttpRoutes(app);
httpServer.listen(envConfig.PORT, () => {
  console.log(`Server ready at http://localhost:${envConfig.PORT}`);
});
