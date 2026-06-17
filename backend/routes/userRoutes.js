import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
} from '../validators/rules.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;
