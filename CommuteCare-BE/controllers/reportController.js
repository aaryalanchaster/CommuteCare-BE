const Report = require('../models/reportModel');
const User= require("../models/userModel")

exports.report = async (req, res, next) => {
  const { email, title, detailedDescription } = req.body;
  const userId=req.userId
const user = await User.findById(userId)
if (!user){
    return res.status(400).json({ message: 'User not found' });
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: 'Invalid email address' });
}
if (email !== user.email) {
    return res.status(400).json({ message: 'Email address does not match with the logged-in user' });
  }
 
  // Validate title
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Validate detailed description
  if (!detailedDescription || detailedDescription.trim().length === 0) {
    return res.status(400).json({ message: 'Detailed description is required' });
  }
  if (detailedDescription.length > 200) {
    return res.status(400).json({ message: 'Detailed description should be less than 200 characters' });
  }

  // Create a new report
  const report = new Report({
    email,
    title,
    detailedDescription,
  });

  try {
    await report.save();
    return res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
