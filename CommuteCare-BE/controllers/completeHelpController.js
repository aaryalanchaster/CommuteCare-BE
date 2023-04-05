const nodemailer = require("nodemailer");
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel')

exports.completeHelp = async (req, res, next) => {
  const bookingId= req.body.bookingId;
  const helperId = req.helperId;

  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, helper: helperId, status: 'accepted' },
      { $set: { status: 'completed' ,rating:null }},
      { new: true }
    );

    if (!booking) {
      return res.status(400).send('Unable to complete help');
    }
    const user = await User.findById(booking.user);
      const email = user.email;
      const fname = user.firstname;
    // Send an email to the user with a link to the feedback page
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "commutecare.noreply@gmail.com",
          pass: "tlvfjxrfdyxluiys",
        },
      });
  
      const mailOptions = {
        from: 'commutecare.noreply@gmail.com',
        to: email,
        subject: 'CommuteCare - Feedback Request',
        html: ` Dear ${fname}, 

<p>We hope you are doing well and that your experience with our helper has been positive. We would like to take this opportunity to request your feedback on the services provided by our helper.</p>

<p>Your feedback is important to us, as it helps us to improve the quality of our services and ensure that our helpers are meeting your needs. Your comments and suggestions will also help us to recognize our helper's strengths and address any areas for improvement.</p> 

<p>To provide feedback, please click on the link below to access our online feedback form:https://commutecare.vercel.app/review?bookingId=${bookingId}</p>

<p>We appreciate your time and input. Thank you for choosing CommuteCare. We are committed to providing you with high-quality care services and look forward to serving you in the future.</p>
        
Best regards, 
CommuteCare Team
        `
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('Server Error');
        } else {
            return res.send("An email has been sent to user to give feedback");;
        }
      });
      await Message.deleteMany({ bookingId: bookingId })
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
