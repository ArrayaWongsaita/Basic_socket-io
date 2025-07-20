import authRoutes from './routes/authRoutes.js';
import authController from './controllers/AuthController.js';

// Import all use cases
import registerUserUseCase from './usecases/RegisterUserUseCase.js';
import loginUserUseCase from './usecases/LoginUserUseCase.js';

export default {
  routes: authRoutes,
  controller: authController,
  usecases: {
    registerUser: registerUserUseCase,
    loginUser: loginUserUseCase,
  },
};
