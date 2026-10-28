import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import validate from '../middleware/validate.js';

const router = Router();

// Public authentication endpoints (no bearer token required)
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

export default router;
