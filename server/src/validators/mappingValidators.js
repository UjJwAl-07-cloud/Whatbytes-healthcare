import { body, param } from 'express-validator';

/**
 * Validation rules for creating a patient-doctor mapping (POST /api/mappings/).
 * Requires positive integer IDs for both patient and doctor.
 */
export const createMappingValidator = [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required.')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer.')
    .toInt(),
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required.')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer.')
    .toInt(),
];

/**
 * Validates route parameter mapping ID for removal (DELETE /api/mappings/:id/).
 */
export const mappingIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Mapping ID must be a positive integer.')
    .toInt(),
];

/**
 * Validates route parameter patient ID for querying assigned doctors (GET /api/mappings/:patientId/).
 */
export const mappingPatientIdValidator = [
  param('patientId')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer.')
    .toInt(),
];
