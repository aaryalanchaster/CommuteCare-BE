const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
//const NodeCache = require('node-cache');
const Helper= require('../models/helperModel')
const User = require('../models/userModel');
const cache=require('../services/cache');
//const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

// Signup route that sends email verification
exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    
    const existingHelper = await Helper.findOne({ email: email });
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    if (existingHelper ) {
      const error = new Error('A helper with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    // Generate OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);

    // Hash password and create user in database
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      email_verified: false
    });
    const savedUser = await user.save();

    // Send OTP to user's email
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
      subject: 'CommuteCare - Verify your email',
      html: `
      <p>Dear Commuter,</p>

      <p>Thank you for choosing CommuteCare which focuses on providing assistance tailored to your requirement. We value your interest and appreciate the trust you have placed in us.</p>
      
      <p>To complete the email verification process, we are sending you a One-Time Password (OTP) to the email address you have provided.</p>
            
      <p>Your OTP is: <strong style="font-size: 13px;">${OTP}</strong><p>
            
      <p>Please note that this OTP is only valid for a limited time, so we recommend that you complete the verification process as soon as possible.</p>
            
      <p>If you did not request this verification or believe this email was sent in error, please disregard this message.</p>
            
      <p>Thank you for your cooperation in this matter. We look forward to serving you.</p>
            
      <p>Best regards,</p>
      <p>CommuteCare Team</p>`
    };
    await transporter.sendMail(mailOptions);

    // Store OTP in cache
    cache.set(email, OTP);

    // Create JWT for user
    const token = jwt.sign({ 
      userId: savedUser._id, 
      email_verified: false 
    }, 'somesupersecretsecret', { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User created! OTP sent to email.', 
      token: token 
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

