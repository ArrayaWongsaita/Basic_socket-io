import userRoutes from './routes/userRoutes.js';
import userController from './controllers/UserController.js';
import User from './entities/User.js';

export default {
  routes: userRoutes,
  controller: userController,
  entity: User,
  usecases: {},
};
