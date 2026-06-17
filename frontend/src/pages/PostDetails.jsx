import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getPost(id);
        setPost(res.post);
      } catch (err) {
        setError(err.message || 'Failed to load post. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handlePostDeleted = () => {
    navigate('/');
  };

  return (
    <div className="main-content" style={{ gridTemplateColumns: '1fr' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Back Link */}
        <Link to="/" className="nav-link" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--glass-bg)', borderRadius: '99px' }}>
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </Link>

        {error && (
          <div className="alert-banner">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="spinner" style={{ marginTop: '80px' }}></div>
        ) : (
          post && (
            <PostCard
              post={post}
              onDelete={handlePostDeleted}
              defaultShowComments={true}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PostDetails;
