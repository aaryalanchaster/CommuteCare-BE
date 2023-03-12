const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ResetToken = require('../models/resetTokenModel');
const Helper = require('../models/helperModel');

exports.resetPassword = async (req, res, next) => {
    let token = req.params.token;
    const newPassword = req.body.password;
  
    // Find the reset token in the database
    const resetToken = await ResetToken.findOne({ token: token, expiresAt: { $gt: new Date() } });
    if (!resetToken) {
   
      return res.status(400).json({message:'Invalid or expired token'})
    }
  
    // Find the helper associated with the reset token
    const helper = await Helper.findOne({ email: resetToken.email });
  
    if (!helper) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
  
    // Update the helper's password and delete the reset token
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    helper.password = hashedPassword;
    await helper.save();
    await resetToken.deleteOne();
    res.status(200).json({message:'Your password is sucessfully reset', token: token, helperId: helper._id.toString() });
  
    // Generate a new access token for the user
     token = jwt.sign(
      {
        email: helper.email,
        userId: helper._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
  
   
  };
  