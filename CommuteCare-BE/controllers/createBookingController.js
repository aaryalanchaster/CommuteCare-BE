const fs = require("fs");
const path = require("path");
const moment = require("moment");
const nodemailer = require("nodemailer");
// const { validationResult } = require('express-validator/check');
const User = require("../models/userModel");
const Helper = require("../models/helperModel");
const Booking = require("../models/bookingModel");



  exports.createBooking = async (req, res, next) => {
    //console.log(req.body);
    const helperId = req.body.helperId;
    const userId = req.userId;
    const day = req.body.day;
    const startTime = req.body.starttime;
    const duration = req.body.duration;
    const date = req.body.date;

    const helper = await Helper.findById(helperId);

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
    const timeArray = helper.availability[day].split(",");
    const availabilityStart = moment(timeArray[0], "HH:mm");
    //console.log("timeArray[0]"+timeArray[0]);
    const availabilityEnd = moment(timeArray[1], "HH:mm");

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
      user: userId,
      day: day,
      $or: [
        {
          starttime: { $lt: end.toDate() },
          endtime: { $gt: start.toDate() },
        },
        { starttime: { $gte: start.toDate(), $lt: end.toDate() } },
        { endtime: { $gt: start.toDate(), $lte: end.toDate() } },
      ],
    });

    if (existingUserBookings.length === 0 && existingBookings.length === 0) {
      const booking = new Booking({
        helper: helperId,
        user: userId,
        day: day,
        starttime: start.toDate(),
        endtime: end.toDate(),
      });
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found.");
      }

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
        subject: "CommuteCare - Booking Comfirmed",
        text: `Hello ${fname}, 
We are pleased to inform you that your booking with Commutecare has been confirmed. We look forward to providing you with our professional and compassionate care services.
      
Your scheduled time and date for the assigned helper are as follows:

Date: ${day}
Time: ${startTime}
Duration: ${duration}
Helper: ${helper.firstname}  ${helper.lastname} 

We wish you a hassle-free commute. 
      
Best Regards, 
CommuteCare Team`,
      };
      await transporter.sendMail(mailOptions);
      await booking.save((err) => {
        if (err) return res.status(500).send(err);

        return res.send("Booking created successfully.");
      });
    } else {
      return res
        .status(422)
        .send("You have already booked a helper in this time slot");
    }
  };

  exports.declinedbooking = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found.");
      }
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
    subject: "CommuteCare - Booking Request Declined",
    text: `Dear ${fname},
    
We regret to inform you that the helper we assigned for your requested time and date has rejected the request. We understand that this is an inconvenience for you, and we apologize for any disruption this may cause to your schedule.
        
We appreciate your patience and understanding as we navigate this situation. 
    
If you have any questions or concerns, please do not hesitate to contact us by phone or email.
    
Thank you for choosing Commutecare. We are committed to providing you with high-quality care services and look forward to serving you in the future.
    
Best regards,
CommuteCare Team `,
  };
  await transporter.sendMail(mailOptions);
  return res.send("Booking declined");
  
}
