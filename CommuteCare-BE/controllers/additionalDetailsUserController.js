const cloudinary = require('../middleware/cloudinary');
const User = require('../models/userModel');
// Update user profile route
exports.updateUserProfile = async (req, res, next) => {
    try {
      const userId = req.userId;
      const firstname = req.body.firstname
      const lastname = req.body.lastname
      const gender = req.body.gender
      const dob = req.body.dob
      const mob = req.body.mob
  
      const user = await User.findById(userId);
  
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
  
      // Update user profile
      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;
      if (gender) user.gender = gender;
      if (dob) user.dob = dob;
      if (mob) user.mob = mob;
      if (req.file) {
        // Upload the profile photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          public_id: `users/${userId}/profile_photo`,
           folder: 'users',
          use_filename: true,
          unique_filename: false
        });
        // Store the Cloudinary URL in the helper document
        user.profilePhotoUrl = result.secure_url;
      }
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  