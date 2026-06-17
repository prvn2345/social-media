import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return next(new ErrorResponse('Username is already taken', 400));
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ErrorResponse('Email is already registered', 400));
    }

    // Create user (password is automatically hashed via mongoose pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Verify password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user has already been populated in protection middleware
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
