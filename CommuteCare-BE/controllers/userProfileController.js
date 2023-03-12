// Get user profile route

const User = require('../models/userModel');
exports.getUserProfile = async (req, res, next) => {
    try {
      const userId = req.userId;
  
      const user = await User.findById(userId);
      console.log(user)
  
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        message: 'User profile retrieved successfully',
        user: user
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  