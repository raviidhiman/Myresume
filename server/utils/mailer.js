const axios = require('axios');

const sendOTPEmail = async (to, otp) => {
  const response = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        name: 'Resume App',
        email: process.env.EMAIL_USER,
      },
      to: [{ email: to }],
      subject: 'Your OTP Code - Resume Login',
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Georgia', serif; background: #f9f9f9; margin: 0; padding: 0; }
              .container { max-width: 480px; margin: 40px auto; background: #fff; border: 1px solid #e0e0e0; padding: 40px; }
              .header { border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 24px; }
              h1 { font-size: 20px; margin: 0; letter-spacing: 0.05em; }
              .otp-box { background: #f5f5f5; border: 1px solid #ddd; padding: 20px; text-align: center; margin: 24px 0; }
              .otp { font-size: 36px; font-weight: bold; letter-spacing: 0.3em; font-family: monospace; color: #000; }
              .note { font-size: 13px; color: #666; margin-top: 8px; }
              .footer { border-top: 1px solid #e0e0e0; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Resume Login Verification</h1>
              </div>
              <p>You requested a one-time password to access your resume dashboard.</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
                <div class="note">Valid for 5 minutes only</div>
              </div>
              <p>If you did not request this, please ignore this email.</p>
              <div class="footer">
                This is an automated message. Do not reply.
              </div>
            </div>
          </body>
        </html>
      `,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

module.exports = { sendOTPEmail };