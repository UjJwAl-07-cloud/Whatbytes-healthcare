import { body, param } from 'express-validator';

/**
 * Validation rules for registering a doctor (POST /api/doctors/).
 * Doctors require a name and medical specialization; contact details are optional.
 */
export const createDoctorValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required.')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters.'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required.')
    .isLength({ max: 255 })
    .withMessage('Specialization must not exceed 255 characters.'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters.'),
];

/**
 * Validation rules for updating a doctor (PUT /api/doctors/:id/).
 * Validates doctor ID route parameter and supports partial updates.
 */
export const updateDoctorValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer.')
    .toInt(),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Doctor name cannot be empty.')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters.'),
  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty.')
    .isLength({ max: 255 })
    .withMessage('Specialization must not exceed 255 characters.'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters.'),
];

/**
 * Validates route parameter doctor ID as a positive integer.
 */
export const doctorIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer.')
    .toInt(),
];
