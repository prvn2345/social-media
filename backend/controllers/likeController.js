import Post from '../models/Post.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Toggle Like / Unlike Post
// @route   POST /api/likes/toggle/:postId
// @access  Private
export const toggleLike = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${postId}`, 404)
      );
    }

    // Check if post is already liked by the user
    const hasLiked = post.likes.includes(req.user._id);

    if (hasLiked) {
      // Already liked, so unlike (remove user ID)
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Not liked yet, so like (add user ID)
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likeCount: post.likes.length,
      isLiked: !hasLiked,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};
