const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateOTP = () => {
  const bytes = crypto.randomBytes(3);
  const num = parseInt(bytes.toString('hex'), 16);
  return String(num % 1000000).padStart(6, '0');
};

/**
 * Returns a Date 5 minutes from now
 */
const getOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

module.exports = { generateOTP, getOTPExpiry };
