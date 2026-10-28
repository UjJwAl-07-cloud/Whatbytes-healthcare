import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import prisma from '../config/prisma.js';

/**
 * Register a new user.
 * POST /api/auth/register/
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in a user and return a JWT token.
 * POST /api/auth/login/
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN, algorithm: 'HS256' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
