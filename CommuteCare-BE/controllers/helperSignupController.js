const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");
const Helper = require("../models/helperModel");
const cache = require("../services/cache");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await User.findOne({ email: email });
    const existingHelper = await Helper.findOne({ email: email });
    if (existingUser) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    else if (existingHelper ) {
      const error = new Error('A helper with this email address already exists');
      error.statusCode = 422;
      throw error;
    }
    // 
    // Generate OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "commutecare.noreply@gmail.com",
        pass: "tlvfjxrfdyxluiys",
      },
    });

    // Create email message with OTP
    const message = {
      from: "commutecare.noreply@gmail.com",
      to: email,
      subject: "CommuteCare - Verify your email",
      html: `<p>Dear Helper,</p>

      <p>Thank you for choosing CommuteCare which focuses on providing assistance tailored to your requirement. We value your interest and appreciate the trust you have placed in us.</p>
            
      <p>To complete the email verification process, we are sending you a One-Time Password (OTP) to the email address you have provided.</p>
            
      <p>Your OTP is: <strong style="font-size: 13px;">${OTP}</strong><p>
            
      <p>Please note that this OTP is only valid for a limited time, so we recommend that you complete the verification process as soon as possible.</p>
            
      <p>If you did not request this verification or believe this email was sent in error, please disregard this message.</p>
            
      <p>Thank you for your cooperation in this matter. We look forward to serving you.</p>
            
      <p>Best regards,</p>
      <p>CommuteCare Team</p>
`,
    };

    // Send email with OTP
    await transporter.sendMail(message);

    // Hash password and create helper in database
    const hashedPw = await bcrypt.hash(password, 12);
    const helper = new Helper({
      // firstname: firstname,
      // lastname: lastname,
      email: email,
      password: hashedPw,
      dob: "",
      mob: "",
      gender: "",
      age: 0,
      helped: 0,
      description: "",
      availability: {
        Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",
      },
      bookings: [],
    });
    const savedHelper = await helper.save();
    cache.set(email, OTP);
    // Create JWT for helper
    const token = jwt.sign(
      {
        helperId: savedHelper._id,
        email_verified: false,
      },
      "somesupersecretsecret",
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "Helper created!",
      token: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
