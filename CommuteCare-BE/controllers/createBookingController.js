const moment = require("moment");
const nodemailer = require("nodemailer");
// const { validationResult } = require('express-validator/check');
const User = require("../models/userModel");
const Helper = require("../models/helperModel");
const Booking = require("../models/bookingModel");



  exports.createBooking = async (req, res, next) => {
    const helperId = req.body.helperId;
    const userId = req.userId;
    const day = req.body.day;
    const startTime = req.body.starttime;
    const duration = req.body.duration;
    const date = req.body.date;
    const location=req.body.location;
    const travelDescription=req.body.description

    const helper = await Helper.findById(helperId);
    const user = await User.findById(userId);

    if (!helper) {
      return res.status(404).send("Helper not found.");
    }
    const helperAvailability = helper.availability[day];
    if (!helperAvailability) {
      return res
        .status(400)
        .send("Helper's availability not set for the specified day.");
    }

    const start = moment(startTime, "hh:mm");
    const end = start.clone().add(duration, "minutes");
    const timeArray = helper.availability[day].split("");
    const availabilityStart = moment(timeArray.slice(0, 5).join(""), "hh:mm");
    const availabilityEnd = moment(timeArray.slice(5).join(""), "hh:mm");

    if (start.isBefore(availabilityStart) || end.isAfter(availabilityEnd)) {
      return res
        .status(400)
        .send(
          "The requested booking time slot is not within the helper's availability for the specified day."
        );
    }

    const existingBookings = await Booking.find({
      helper: helperId,
      day: day,
      status: { $ne: "completed" },
      $or: [
        { starttime: { $lt: end.toDate() }, endtime: { $gt: start.toDate() } }, // new booking starts during an existing booking
        { starttime: { $gte: start.toDate(), $lt: end.toDate() } }, // new booking starts before an existing booking
        { endtime: { $gt: start.toDate(), $lte: end.toDate() } }, // new booking ends after an existing booking
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).send("This time slot is already booked.");
    }
    const existingUserBookings = await Booking.find({
      user: req.userId,
      day: day,
      status: { $ne: "completed" },
      $or: [
        {
          starttime: { $lt: end.toDate() },
          endtime: { $gt: start.toDate() },
        },
        { starttime: { $gte: start.toDate(), $lt: end.toDate() } },
        { endtime: { $gt: start.toDate(), $lte: end.toDate() } },
      ],
    });

    if (existingUserBookings.length > 0) {
      return res.status(400).send("User has already booked this time slot.");
    }
    if (existingUserBookings.length === 0 && existingBookings.length === 0) {
      const booking = new Booking({
        helper: helperId,
        user: userId,
        day: day,
        date:date,
        starttime: start,
        endtime: end,
        duration:duration,
        status:"pending",
        location:location,
        description:travelDescription    
      });
      
    await booking.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "commutecare.noreply@gmail.com",
        pass: "tlvfjxrfdyxluiys",
      },
    });
    const helperMailOptions = {
      from: "commutecare.noreply@gmail.com",
      to: helper.email,
      subject: "CommuteCare - Booking Request",
      html: `Dear ${helper.firstname},
    
<p>We hope this email finds you well. A booking request has been made for your services on ${date}. Please log in to your account and accept or reject the request at your earliest convenience.</p>

<p>We understand that you may have other commitments and may not be able to accept all booking requests. However, we encourage you to accept bookings whenever possible, as this helps us to provide quality care services to our clients.</p> 
      
<p>If you have any questions or concerns, please do not hesitate to contact us by phone or email. We are here to assist you in any way we can.</p>
      
<p>Thank you for being a part of the CommuteCare team and for providing quality care services to our clients.</p> 
      
<p>Best regards,</p> 
      
CommuteCare Team `,
    };
    const userMailOptions = {
      from: "commutecare.noreply@gmail.com",
      to: user.email,
      subject: "CommuteCare - Booking Request",
      html: `Dear ${user.firstname},
    
<p>We have received your booking request for a helper on ${date}. We are now processing your request and will assign a helper as soon as possible.</p> 
<p>We understand that finding reliable care services can be challenging, and we thank you for choosing CommuteCare. We strive to provide the best care services to our clients, and we are confident that our helper will provide quality care services to you.</p> 
<p>Once a helper has been assigned, you will receive an email confirming the booking. In the meantime, please feel free to contact us if you have any questions or concerns regarding the booking. We are here to assist you in any way we can.</p>
<p>Thank you for choosing CommuteCare. We look forward to serving you.</p> 
<p>Best regards,</p> 
CommuteCare Team `,
    };
    await transporter.sendMail(helperMailOptions);
    await transporter.sendMail(userMailOptions);

    return res.send("Booking request sent successfully.");
    }
  };
  exports.acceptBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const helperId = req.helperId;
  
    try {
      const booking = await Booking.findById(bookingId).populate("helper");
  
      if (!booking) {
        return res.status(404).send("Booking not found.");
      }
  
      if (booking.helper._id.toString() !== helperId) {
        return res.status(403).send("Unauthorized.");
      }
  
      booking.status = 'accepted';
      await booking.save();
  
      const user = await User.findById(booking.user);
      const email = user.email;
      const fname = user.firstname;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "commutecare.noreply@gmail.com",
          pass: "tlvfjxrfdyxluiys",
        },
      });
      const userMailOptions = {
        from: "commutecare.noreply@gmail.com",
        to: email,
        subject: "CommuteCare - Booking Request Accepted",
        text: `Dear ${fname},
      
We are pleased to inform you that your booking request has been accepted.
  
Your scheduled time and date for the assigned helper are as follows:
  
Date: ${booking.date}
Time: ${moment(booking.starttime).format("hh:mm")}
Duration: ${booking.duration} minutes
Helper: ${booking.helper.firstname} ${booking.helper.lastname}
  
We wish you a hassle-free commute.
  
Best Regards,
CommuteCare Team`,
      };
 
      await transporter.sendMail(userMailOptions);
     
  
      return res.send("Booking request accepted successfully.");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };
  
  exports.declineBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const helperId = req.helperId;
    try {
      const booking = await Booking.findById(bookingId).populate("helper");
  
      if (!booking) {
        return res.status(404).send("Booking not found.");
      }
  
      if (booking.helper._id.toString() !== helperId) {
        return res.status(403).send("Unauthorized.");
      }
  
      booking.status = "rejected";
      await booking.save();
  
      const user = await User.findById(booking.user);
      const email = user.email;
      const fname = user.firstname;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "commutecare.noreply@gmail.com",
          pass: "tlvfjxrfdyxluiys",
        },
      });
      const mailOptions = {
        from: "commutecare.noreply@gmail.com",
        to: email,
        subject: "CommuteCare - Booking Request Rejected",
        html: `Dear ${fname}, 

<p>We regret to inform you that your booking request for ${booking.date} has been rejected due to the unavailability of our helper. We apologize for any inconvenience this may cause you.</p>
<p>However, we have alternative booking options available for you. Please follow the link below to view and book available slots that meet your requirements.</p>
[Link to available bookings] 
<p>We understand that finding reliable care services can be challenging, and we thank you for choosing CommuteCare. We strive to provide the best care services to our clients, and we are confident that our helpers will provide quality care services to you.</p> 
<p>Please feel free to contact us if you have any questions or concerns regarding the booking. We are here to assist you in any way we can.</p> 
<p>Thank you for choosing CommuteCare. We look forward to serving you.</p> 
        
<p>Best regards,</p> 
CommuteCare Team `,
      };
      await transporter.sendMail(mailOptions);
      return res.send("Booking request rejected successfully.");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };
  