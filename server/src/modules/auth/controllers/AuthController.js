import registerUserUseCase from '../usecases/RegisterUserUseCase.js';
import loginUserUseCase from '../usecases/LoginUserUseCase.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { userMap } from '../../users/repositories/UserRepository.js';
import jwt from 'jsonwebtoken';
import envConfig from '../../../shared/config/env.config.js';

class AuthController {
  async register(req, res) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.errors.map((e) => e.message).join(', '),
        });
      }

      const user = await registerUserUseCase.execute(parsed.data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message.includes('required') ||
        error.message.includes('must be')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        // ZodError: parsed.error is a ZodError instance, use .issues for array of errors
        const errorMsg = Array.isArray(parsed.error?.issues)
          ? parsed.error.issues.map((e) => e.message).join(', ')
          : 'Invalid input';
        return res.status(400).json({
          success: false,
          message: errorMsg,
        });
      }
      const { email, password } = parsed.data;

      const user = await loginUserUseCase.execute(email, password);
      res.json({
        success: true,
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      if (
        error.message.includes('required') ||
        error.message.includes('Valid email')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async verify(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

export default new AuthController();
