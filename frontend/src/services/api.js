const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data.error ||
      (data.errors && data.errors.map((e) => e.message).join(', ')) ||
      'An error occurred';
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Auth
  register: (userData) =>
    apiFetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    apiFetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getProfile: () => apiFetch('/api/users/profile'),

  // Posts
  getPosts: (page = 1, limit = 5) =>
    apiFetch(`/api/posts?page=${page}&limit=${limit}`),
  getPost: (id) => apiFetch(`/api/posts/${id}`),
  createPost: (postData) =>
    apiFetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  updatePost: (id, postData) =>
    apiFetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),
  deletePost: (id) =>
    apiFetch(`/api/posts/${id}`, {
      method: 'DELETE',
    }),

  // Comments
  getComments: (postId) => apiFetch(`/api/comments/post/${postId}`),
  addComment: (commentData) =>
    apiFetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
  deleteComment: (commentId) =>
    apiFetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    }),

  // Likes
  toggleLike: (postId) =>
    apiFetch(`/api/likes/toggle/${postId}`, {
      method: 'POST',
    }),
};
