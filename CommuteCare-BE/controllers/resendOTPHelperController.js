const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
//const NodeCache = require('node-cache');

const Helper = require('../models/helperModel');
const cache=require('../services/cache');

// Resend OTP route
exports.resendOtp = async (req, res, next) => {
    try {
      const email = req.body.email;
  
      // Find user in database
      const helper = await Helper.findOne({ email: email });
  
      if (!helper) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
  
      // Get the number of resend attempts from the cache
      let resendCount = cache.get(`resend_${email}`) || 0;
  
      if (resendCount >= 3) {
        const error = new Error('Maximum resend attempts exceeded.');
        error.statusCode = 401;
        throw error;
      }
  
      // Generate new OTP and send it to user's email
      const otp = Math.floor(1000 + Math.random() * 9000);
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
        subject: 'Verify Your Email',
        text: `Your OTP is: ${otp}`
      };
      await transporter.sendMail(mailOptions);
  
      // Store new OTP in cache
      cache.set(email, otp);
  
      // Increment the number of resend attempts in the cache
      cache.set(`resend_${email}`, resendCount + 1);
  
      res.status(200).json({ message: 'OTP sent!' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  