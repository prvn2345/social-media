import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { ChevronLeft, ChevronRight, MessageSquare, ShieldAlert, Zap } from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getPosts(page, 5); // 5 posts per page
      setPosts(res.posts);
      setTotalPages(res.pages || 1);
      setTotalPosts(res.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts. Server might be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setTotalPosts(prev => prev + 1);
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
    setTotalPosts(prev => Math.max(0, prev - 1));
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="main-content">
      {/* Sidebar Profile Card */}
      <div className="sidebar">
        {user ? (
          <div className="glass-card profile-summary">
            <img src={user.avatar} alt={user.username} />
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <div style={{ borderTop: '1px solid var(--card-border)', width: '100%', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Member</span>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Join VibeNet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Create an account or login to post comments, like, and share thoughts with others!
            </p>
          </div>
        )}

        <div className="glass-card" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={14} style={{ color: 'var(--accent-color)' }} />
            <span>Trending Tags</span>
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
            <li><a href="#" style={{ textDecoration: 'none' }}>#mernstack</a></li>
            <li><a href="#" style={{ textDecoration: 'none' }}>#webdev</a></li>
            <li><a href="#" style={{ textDecoration: 'none' }}>#reactjs</a></li>
          </ul>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="feed-container">
        {user && <CreatePost onPostCreated={handlePostCreated} />}

        {error && (
          <div className="alert-banner">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="spinner" style={{ marginTop: '80px' }}></div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <MessageSquare size={40} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
                <h3>No posts yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Be the first to create a post on this server!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
              ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="glass-btn secondary"
                  style={{ padding: '8px 12px' }}
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="glass-btn secondary"
                  style={{ padding: '8px 12px' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
