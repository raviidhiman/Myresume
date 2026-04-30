import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await API.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      toast.success('OTP sent! Check your email.');
      navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ borderBottom: '1.5px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 className="auth-title">Owner Login</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Enter your registered email to receive a one-time password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading || !email.trim()}>
            {loading ? 'Sending OTP...' : 'Send OTP →'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="auth-link">← Back to Resume</Link>
        </div>
      </div>
    </div>
  );
}