import { Router } from 'express';
import { create, getAll, getById, update, remove } from '../controllers/patientController.js';
import { createPatientValidator, updatePatientValidator, patientIdValidator } from '../validators/patientValidators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';

const router = Router();

// Authorization: All patient routes require a valid JWT token.
// Ownership constraint: Operations are strictly scoped to the authenticated user's records.
router.use(authenticate);

router.post('/', createPatientValidator, validate, create);
router.get('/', getAll);
router.get('/:id', patientIdValidator, validate, getById);
router.put('/:id', updatePatientValidator, validate, update);
router.delete('/:id', patientIdValidator, validate, remove);

export default router;
