import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, LogOut, LogIn, UserPlus, Home, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <MessageSquare size={26} strokeWidth={2.5} style={{ color: '#8b5cf6' }} />
        <span>VibeNet</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <Home size={18} />
          <span>Feed</span>
        </NavLink>

        {user ? (
          <>
            <span className="nav-link" style={{ cursor: 'default' }}>
              <User size={18} />
              <span>{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="glass-btn secondary"
              style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '0.85rem' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <UserPlus size={18} />
              <span>Register</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
