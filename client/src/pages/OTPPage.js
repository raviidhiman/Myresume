import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function OTPPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // take last char
    setDigits(newDigits);

    // Auto-advance
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (value && index === OTP_LENGTH - 1) {
      const fullOTP = [...newDigits.slice(0, index), value.slice(-1)].join('');
      if (fullOTP.length === OTP_LENGTH) {
        submitOTP(fullOTP);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newDigits = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
    if (pasted.length === OTP_LENGTH) submitOTP(pasted);
  };

  const submitOTP = async (otp) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      login(res.data.token);
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    try {
      await API.post('/auth/send-otp', { email });
      toast.success('New OTP sent!');
      setResendTimer(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  const handleManualSubmit = () => {
    const otp = digits.join('');
    if (otp.length === OTP_LENGTH) submitOTP(otp);
  };

  if (!email) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ borderBottom: '1.5px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {/* OTP Digit Inputs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                className="otp-digit"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Paste your OTP directly or type digit by digit
          </p>
        </div>

        <button
          className="btn-submit"
          onClick={handleManualSubmit}
          disabled={loading || digits.join('').length < OTP_LENGTH}
        >
          {loading ? 'Verifying...' : 'Verify & Login →'}
        </button>

        {/* Timer & Resend */}
        <div className="timer-text" style={{ marginTop: '16px' }}>
          {resendTimer > 0 ? (
            <span>Resend OTP in <strong>{resendTimer}s</strong></span>
          ) : (
            <span>
              Didn't receive the code?{' '}
              <span
                className="auth-link"
                onClick={handleResend}
                style={{ cursor: resending ? 'wait' : 'pointer' }}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </span>
            </span>
          )}
        </div>

        <div className="auth-footer" style={{ marginTop: '12px' }}>
          <Link to="/login" className="auth-link">← Change email</Link>
        </div>
      </div>
    </div>
  );
}
