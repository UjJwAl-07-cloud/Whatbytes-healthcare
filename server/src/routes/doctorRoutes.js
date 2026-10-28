import { Router } from 'express';
import { create, getAll, getById, update, remove } from '../controllers/doctorController.js';
import { createDoctorValidator, updateDoctorValidator, doctorIdValidator } from '../validators/doctorValidators.js';
import validate from '../middleware/validate.js';
import authenticate from '../middleware/auth.js';

const router = Router();

// Authorization: All doctor routes require a valid JWT token.
// Directory model: Doctors form a shared directory accessible to all authenticated staff.
router.use(authenticate);

router.post('/', createDoctorValidator, validate, create);
router.get('/', getAll);
router.get('/:id', doctorIdValidator, validate, getById);
router.put('/:id', updateDoctorValidator, validate, update);
router.delete('/:id', doctorIdValidator, validate, remove);

export default router;
