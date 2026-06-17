import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetails from './pages/PostDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Feed page is public, but interactions inside it check for authentication */}
            <Route path="/" element={<Feed />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Single Post Details */}
            <Route path="/posts/:id" element={<PostDetails />} />
            
            {/* Catch all fallback redirects to Feed */}
            <Route path="*" element={<Feed />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
