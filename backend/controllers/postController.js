import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl || '',
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'username avatar'
    );

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (with pagination)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      page,
      pages: Math.ceil(total / limit),
      total,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username avatar'
    );

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse('Not authorized to update this post', 403)
      );
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }

    await post.save();

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'username avatar'
    );

    res.status(200).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post and its comments
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse('Not authorized to delete this post', 403)
      );
    }

    // Delete post
    await Post.findByIdAndDelete(req.params.id);

    // Cascading delete for comments belonging to this post
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
