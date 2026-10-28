import { body, param } from 'express-validator';

/**
 * Validation rules for creating a patient (POST /api/patients/).
 * Enforces positive integer age, strict gender whitelist, and safe string bounds.
 */
export const createPatientValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required.')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters.'),
  body('age')
    .notEmpty()
    .withMessage('Age is required.')
    .isInt({ min: 0 })
    .withMessage('Age must be a positive integer.')
    .toInt(),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required.')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be one of: Male, Female, Other.'),
  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters.'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters.'),
];

/**
 * Validation rules for updating a patient (PUT /api/patients/:id/).
 * Validates the route parameter ID while allowing partial updates on patient fields.
 */
export const updatePatientValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer.')
    .toInt(),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Patient name cannot be empty.')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters.'),
  body('age')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Age must be a positive integer.')
    .toInt(),
  body('gender')
    .optional()
    .trim()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be one of: Male, Female, Other.'),
  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters.'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters.'),
];

/**
 * Validates route parameter patient ID as a positive integer.
 */
export const patientIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer.')
    .toInt(),
];
