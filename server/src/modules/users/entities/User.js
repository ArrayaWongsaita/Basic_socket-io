class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Remove sensitive data before sending to client
  toPublic() {
    const { password, ...publicData } = this;
    return publicData;
  }

  // Validate user data
  static validate(userData) {
    const errors = [];

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.username || userData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUpdate(userData) {
    const errors = [];

    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (userData.username && userData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default User;
