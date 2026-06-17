import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { postValidator } from '../validators/rules.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, postValidator, validateRequest, createPost);
router.put('/:id', protect, postValidator, validateRequest, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
