const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ResetToken = require('../models/resetTokenModel');
const User = require('../models/userModel');

exports.resetPassword = async (req, res, next) => {
    let token = req.params.token;
    const newPassword = req.body.password;
  
    // Find the reset token in the database
    const resetToken = await ResetToken.findOne({ token: token, expiresAt: { $gt: new Date() } });
  
    if (!resetToken) {
   
      return res.status(400).json({message:'Invalid or expired token'})
    }
    // Find the user associated with the reset token
    const user = await User.findOne({ email: resetToken.email });
  
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
  
    // Update the user's password and delete the reset token
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    await resetToken.deleteOne();
  
    // Generate a new access token for the user
     token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
  
    res.status(200).json({ token: token, userId: user._id.toString() });
  };
  