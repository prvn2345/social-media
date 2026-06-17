import express from 'express';
import { toggleLike } from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/toggle/:postId', protect, toggleLike);

export default router;
