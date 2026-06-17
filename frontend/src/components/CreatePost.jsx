import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Image, FileText, AlertCircle } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createPost({ title, content, imageUrl });
      onPostCreated(res.post);
      
      // Reset fields
      setTitle('');
      setContent('');
      setImageUrl('');
    } catch (err) {
      setError(err.message || 'Failed to create post. Verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="create-post-header">
        <PlusCircle size={20} style={{ color: 'var(--primary-color)' }} />
        <span>Create a New Post</span>
      </div>

      {error && (
        <div className="alert-banner" style={{ marginTop: '14px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-post-form" style={{ marginTop: '16px' }}>
        <div className="form-group">
          <input
            type="text"
            required
            className="glass-input"
            placeholder="Give your post a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <textarea
            required
            className="glass-input"
            placeholder="Write details of your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
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
              placeholder="Optional image URL (e.g., https://unsplash.com/...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {imageUrl && imageUrl.startsWith('http') && (
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image Preview:</span>
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '4px',
                border: '1px solid var(--card-border)',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="glass-btn" style={{ alignSelf: 'flex-end', marginTop: '4px' }}>
          <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
