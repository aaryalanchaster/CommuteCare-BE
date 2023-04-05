const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ResetToken = require('../models/resetTokenModel');
const User = require('../models/userModel');

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  // If user with email exists, generate a unique token and save it to the database
  if (user) {
    const token = crypto.randomBytes(20).toString('hex');
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);
    const resetToken = new ResetToken({ email: email, token: token, expiresAt: expirationTime });
    await resetToken.save();

    // Send an email to the user with a link to the password reset form
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'commutecare.noreply@gmail.com',
        pass: 'tlvfjxrfdyxluiys'
      }
    });

    const mailOptions = {
      from: 'commutecare.noreply@gmail.com',
      to: email,
      subject: 'CommuteCare - Password Reset',
      text: `Hello from Commute Care,
We have received a request to reset your password on Commutecare. To create a new password, please click on the link below:
      
https://commutecare.vercel.app/newPassword?token=${token}
      
Thank you for choosing Commutecare. We are committed to protecting your account and ensuring the security of your personal information.
      
Best regards,
CommuteCare Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.send('Email sent!');
  } else {
    res.status(404).send('User not found.');
  }
};


