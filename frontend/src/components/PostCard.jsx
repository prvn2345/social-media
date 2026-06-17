import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Heart, MessageSquare, Trash2, Edit3, Image, X, Check } from 'lucide-react';

const PostCard = ({ post: initialPost, onDelete, defaultShowComments = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  
  // Comment drawer state
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Auto-fetch comments if defaultShowComments is enabled
  useEffect(() => {
    if (defaultShowComments && post._id) {
      fetchComments();
    }
  }, [defaultShowComments, post._id]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const isAuthor = user && (post.author._id === user._id || post.author === user._id);

  // Time formatting
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.toggleLike(post._id);
      setIsLiked(res.isLiked);
      setLikeCount(res.likeCount);
      setPost({ ...post, likes: res.likes });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleToggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentError('');
    try {
      const res = await api.getComments(post._id);
      setComments(res.comments);
    } catch (err) {
      setCommentError('Could not load comments.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    setCommentError('');
    try {
      const res = await api.addComment({ postId: post._id, content: newComment });
      setComments([res.comment, ...comments]);
      setNewComment('');
      setPost({ ...post, commentCount: post.commentCount + 1 });
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      setPost({ ...post, commentCount: Math.max(0, post.commentCount - 1) });
    } catch (err) {
      alert(err.message || 'Failed to delete comment.');
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const res = await api.updatePost(post._id, {
        title: editTitle,
        content: editContent,
        imageUrl: editImageUrl,
      });
      setPost(res.post);
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update post.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this post? This will delete all comments as well.')) return;

    try {
      await api.deletePost(post._id);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      alert(err.message || 'Failed to delete post.');
    }
  };

  return (
    <div className="glass-card post-card">
      {/* Header */}
      <div className="post-card-header">
        <div className="post-author-info">
          <img
            src={
              post.author.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.username || 'user'}`
            }
            alt={post.author.username}
          />
          <div className="post-author-details">
            <h4>{post.author.username || 'Anonymous'}</h4>
            <span>{formatTime(post.createdAt)}</span>
          </div>
        </div>

        {isAuthor && !isEditing && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsEditing(true)}
              className="post-action-btn"
              title="Edit Post"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={handleDeletePost}
              className="post-action-btn"
              title="Delete Post"
              style={{ color: 'var(--danger)' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <form onSubmit={handleUpdatePost} className="create-post-form" style={{ marginTop: '10px' }}>
          {editError && <div className="alert-banner">{editError}</div>}
          <div className="form-group">
            <input
              type="text"
              required
              className="glass-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Post Title"
            />
          </div>
          <div className="form-group">
            <textarea
              required
              className="glass-input"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
            />
          </div>
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Image
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dark)',
                }}
              />
              <input
                type="text"
                className="glass-input"
                style={{ paddingLeft: '40px' }}
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Optional Image URL (https://...)"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="glass-btn secondary"
              disabled={editLoading}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="glass-btn" disabled={editLoading}>
              <Check size={16} />
              <span>{editLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* View Content */
        <>
          <div>
            <Link to={`/posts/${post._id}`}>
              <h3 className="post-card-title">{post.title}</h3>
            </Link>
            <p className="post-card-content" style={{ marginTop: '8px' }}>
              {post.content}
            </p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="post-card-image" />
            )}
          </div>

          {/* Footer Actions */}
          <div className="post-card-footer">
            <button
              onClick={handleLike}
              className={`post-action-btn ${isLiked ? 'liked' : ''}`}
            >
              <Heart size={18} />
              <span>{likeCount} Likes</span>
            </button>
            <button onClick={handleToggleComments} className="post-action-btn">
              <MessageSquare size={18} />
              <span>{post.commentCount} Comments</span>
            </button>
          </div>

          {/* Comments Panel */}
          {showComments && (
            <div className="comments-panel">
              {user && (
                <div className="comment-input-container">
                  <img src={user.avatar} alt={user.username} />
                  <form onSubmit={handleAddComment} className="comment-form">
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit" className="glass-btn" style={{ padding: '8px 16px' }}>
                      Post
                    </button>
                  </form>
                </div>
              )}

              {commentError && <div className="alert-banner">{commentError}</div>}

              {commentsLoading ? (
                <div className="spinner" style={{ margin: '10px auto' }}></div>
              ) : (
                <div className="comment-list">
                  {comments.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', textAlign: 'center' }}>
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const isCommentOwner = user && comment.user && (comment.user._id === user._id || comment.user === user._id);
                      const isPostOwner = user && (post.author._id === user._id || post.author === user._id);
                      const canDelete = isCommentOwner || isPostOwner;

                      return (
                        <div key={comment._id} className="comment-item">
                          <img
                            src={
                              comment.user?.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.username || 'user'}`
                            }
                            alt={comment.user?.username || 'User'}
                          />
                          <div className="comment-content-box">
                            <div className="comment-user-info">
                              <h5>{comment.user?.username || 'Anonymous'}</h5>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{formatTime(comment.createdAt)}</span>
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="comment-delete-btn"
                                    title="Delete Comment"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostCard;
