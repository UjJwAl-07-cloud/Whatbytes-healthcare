import { validationResult } from 'express-validator';

/**
 * Middleware that checks for validation errors from express-validator.
 * Returns a 400 response with error details if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

export default validate;
