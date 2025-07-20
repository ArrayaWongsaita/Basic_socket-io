import bcrypt from 'bcryptjs';
import userRepository from '../../users/repositories/UserRepository.js';
import User from '../../users/entities/User.js';

class RegisterUserUseCase {
  async execute(userData) {
    try {
      // Validate user data
      const validation = User.validate(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Check if user already exists by email
      const existingUserByEmail = await userRepository.findByEmail(
        userData.email
      );
      if (existingUserByEmail) {
        throw new Error('Email already exists');
      }

      // Check if user already exists by username
      const existingUserByUsername = await userRepository.findByUsername(
        userData.username
      );
      if (existingUserByUsername) {
        throw new Error('Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const newUser = await userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      return newUser.toPublic();
    } catch (error) {
      throw error;
    }
  }
}

export default new RegisterUserUseCase();
