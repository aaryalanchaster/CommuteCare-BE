const nodemailer = require("nodemailer");
const Booking = require("../models/bookingModel");

exports.deleteBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const userId = req.userId;
  
    const booking = await Booking.findById(bookingId).populate('user', 'firstname email').populate('helper','firstname email')
    ;
  
    if (!booking) {
      return res.status(404).send("Booking not found.");
    }
  
    if (booking.user._id.toString() !== userId.toString()) {
      return res.status(403).send("You are not authorized to delete this booking.");
    }
  
    await booking.remove((err) => {
      if (err) return res.status(500).send(err);
      return res.send("Booking deleted successfully.");
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "commutecare.noreply@gmail.com",
        pass: "tlvfjxrfdyxluiys",
      },
    });
    
    const { firstname: username, email: useremail } = booking.user;
    const { firstname: helpername, email: helperemail } = booking.helper;
    const userMailOptions = {
      from: 'commutecare.noreply@gmail.com',
      to: useremail,
      subject: 'CoomuteCare-Booking cancellation',
      html: ` Dear ${username}, 

<p>We are sorry to hear that you have cancelled your booking with our helper. We understand that circumstances can change, and we appreciate you letting us know in advance.</p> 
<p>If you would like to rebook our services in the future, please don't hesitate to contact us. We value your business and would be more than happy to assist you with any of your care needs.</p> 
<p>Thank you for choosing CommuteCare. If you have any questions or concerns, please do not hesitate to contact us by phone or email.</p>
      
<p>Best regards,</p>
CommuteCare Team,
      `
    };
    const helperMailOptions = {
      from: 'commutecare.noreply@gmail.com',
      to: helperemail,
      subject: 'CommuteCare-Booking cancellation',
      html: ` Dear ${helpername}, 
      
<p>We regret to inform you that the booking for ${username} on ${booking.date} has been cancelled by the client. We apologize for any inconvenience this may cause you.</p>
<p>If you have any questions or concerns, please do not hesitate to contact us by phone or email. We look forward to working with you in the future.</p>
<p>Thank you for your understanding.</p>
      
<p>Best regards,</p>
CommuteCare Team
      `
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(helperMailOptions);
  };
  