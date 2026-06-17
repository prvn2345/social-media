import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Add a comment to a post
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  const { content, postId } = req.body;

  try {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${postId}`, 404)
      );
    }

    // Create comment
    const comment = await Comment.create({
      content,
      user: req.user._id,
      post: postId,
    });

    // Increment post's comment count
    post.commentCount = post.commentCount + 1;
    await post.save();

    // Populate user profile info
    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'username avatar'
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments of a post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getPostComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    const post = await Post.findById(comment.post);
    if (!post) {
      return next(new ErrorResponse('Associated post not found', 404));
    }

    // Authorization:
    // ✅ Comment Owner can delete comment
    // ✅ Post Owner can delete any comment on their post
    const isCommentOwner = comment.user.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return next(
        new ErrorResponse('Not authorized to delete this comment', 403)
      );
    }

    // Delete comment
    await Comment.findByIdAndDelete(req.params.id);

    // Decrement post's comment count
    if (post.commentCount > 0) {
      post.commentCount = post.commentCount - 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
