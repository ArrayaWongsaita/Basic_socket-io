import User from '../entities/User.js';

const userMap = new Map();

// mock repository for user data
// mock user data storage
userMap.set('john@example.com', {
  id: '1',
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashed_password',
});

userMap.set('jane@example.com', {
  id: '2',
  username: 'jane_doe',
  email: 'jane@example.com',
  password: 'hashed_password',
});

class UserRepository {
  async create(userData) {
    if (userMap.has(userData.email)) {
      throw new Error('Email already exists');
    }
    userMap.set(userData.email, { ...userData });
    return new User(userData);
  }

  async findByEmail(email) {
    const user = userMap.get(email);
    return user ? new User(user) : null;
  }

  async findById(id) {
    for (const user of userMap.values()) {
      if (user.id === id) return new User(user);
    }
    return null;
  }

  async findByUsername(username) {
    for (const user of userMap.values()) {
      if (user.username === username) return new User(user);
    }
    return null;
  }

  async findAll(options = {}) {
    return Array.from(userMap.values()).map((user) => new User(user));
  }

  async update(email, userData) {
    if (!userMap.has(email)) throw new Error('User not found');
    const user = userMap.get(email);
    const updated = { ...user, ...userData };
    userMap.set(email, updated);
    return new User(updated);
  }

  async delete(email) {
    return userMap.delete(email);
  }

  async count() {
    return userMap.size;
  }

  async exists(field, value) {
    for (const user of userMap.values()) {
      if (user[field] === value) return true;
    }
    return false;
  }
}

export default new UserRepository();
export { userMap };
