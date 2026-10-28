import { Router } from 'express';
import { create, getAll, getByPatientId, remove } from '../controllers/mappingController.js';
import { createMappingValidator, mappingIdValidator, mappingPatientIdValidator } from '../validators/mappingValidators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';

const router = Router();

// Authorization: All mapping routes require a valid JWT token.
// Ownership constraint: Mappings can only be created, viewed, or deleted for patients owned by the user.
router.use(authenticate);

router.post('/', createMappingValidator, validate, create);
router.get('/', getAll);
router.get('/:patientId', mappingPatientIdValidator, validate, getByPatientId);
router.delete('/:id', mappingIdValidator, validate, remove);

export default router;
