import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { commentValidator } from '../validators/rules.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/post/:postId', getPostComments);

// Protected routes
router.post('/', protect, commentValidator, validateRequest, addComment);
router.delete('/:id', protect, deleteComment);

export default router;
