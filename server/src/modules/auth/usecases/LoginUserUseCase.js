import bcrypt from 'bcryptjs';
import userRepository from '../../users/repositories/UserRepository.js';
import User from '../../users/entities/User.js';
import jwt from 'jsonwebtoken';
import envConfig from '../../../shared/config/env.config.js';
import { faker } from '@faker-js/faker';
class LoginUserUseCase {
  async execute(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!User.isValidEmail(email)) {
        throw new Error('Valid email is required');
      }
      let user;
      // Mock user
      if (email === 'random@example.com' && password === 'password123') {
        user = new User({
          id: faker.string.uuid(),
          email: faker.internet.email(),
          username: faker.internet.username(),
          name: faker.person.fullName(),
          password: bcrypt.hashSync('password123', 10), // Mock hashed password
        });
      } else {
        // Find user by email
        user = await userRepository.findByEmail(email);
        if (!user) {
          throw new Error('Invalid credentials');
        }
      }

      // Check password
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   throw new Error('Invalid credentials');
      // }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, id: user.id },
        envConfig.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { user: { ...user.toPublic() }, token };
    } catch (error) {
      throw error;
    }
  }
}

export default new LoginUserUseCase();
