import jwt from 'jsonwebtoken';
import envConfig from '../../../shared/config/env.config.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' });
  }
  jwt.verify(token, envConfig.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
