import { body } from 'express-validator';

/**
 * Validation rules for user registration (POST /api/auth/register/).
 * Requires a non-empty name, a valid normalized email, and a password
 * with length between 6 and 128 characters (to protect bcrypt hashing).
 */
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .isLength({ max: 128 })
    .withMessage('Password must not exceed 128 characters.'),
];

/**
 * Validation rules for user login (POST /api/auth/login/).
 * Enforces email format normalization and non-empty password presence.
 */
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];
