import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <nav className="navbar no-print">
      <div className="navbar-inner">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">CV</span>
          <span className="logo-text"></span>
        </Link>

        {/* Right actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {!isDashboard && (
                <Link to="/dashboard" className="btn-nav btn-secondary">
                  Edit Resume
                </Link>
              )}
              {isDashboard && (
                <Link to="/" className="btn-nav btn-secondary">
                  View Resume
                </Link>
              )}
              <button onClick={handleLogout} className="btn-nav btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-nav btn-primary">
              Owner Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
