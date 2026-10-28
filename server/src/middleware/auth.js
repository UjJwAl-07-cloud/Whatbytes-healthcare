import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import prisma from '../config/prisma.js';

/**
 * JWT authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the user object to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token payload.',
        });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    // Confirm user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
