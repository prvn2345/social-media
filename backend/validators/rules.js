import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const postValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be longer than 100 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Please provide a valid image URL'),
];

export const commentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  body('postId')
    .trim()
    .notEmpty()
    .withMessage('Post ID is required')
    .isMongoId()
    .withMessage('Invalid Post ID format'),
];
