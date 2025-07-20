import express from 'express';
import authController from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Auth routes
router.post('/signup', authController.register.bind(authController));
router.post('/signin', authController.login.bind(authController));
router.get(
  '/verify',
  authenticateToken,
  authController.verify.bind(authController)
);

export default router;
