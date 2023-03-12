const User = require('../models/userModel');
const cache=require('../services/cache');

// Verify email route
exports.verifyEmail = async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const email = req.body.email;
  
      // Retrieve OTP from cache
      const cachedOtp = cache.get(email);
  
      if (!cachedOtp) {
        const error = new Error('OTP has expired or is invalid.');
        error.statusCode = 401;
        throw error;
      }
  
      if (otp !== cachedOtp) {
        const error = new Error('OTP is invalid.');
        error.statusCode = 401;
        throw error;
      }
  
      // Update user's email_verified status in the database
      await User.updateOne({ email: email }, { email_verified: true });
  
      res.status(200).json({ message: 'Email verified!' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  