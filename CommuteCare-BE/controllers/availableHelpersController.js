// const fs = require('fs');
// const path = require('path');
// const moment= require("moment");
// const Helper= require('../models/helperModel')
// const Booking=require('../models/bookingModel')
// // const { validationResult } = require('express-validator/check');

// exports.getHelpers = async (req, res, next) => {
//   const day = req.query.day;
//   const time = req.query.time;
//   const duration = req.query.duration;

//   const durationObject = moment.duration({ minutes: duration });
//   const endTime = moment(time, 'hh:mm').add(durationObject.asHours(), 'hours');

//   // Find all helpers who are available on the requested day
//   Helper.find({ ["availability." + day]: { $exists: true } }, async (err, helpers_) => {
//     if (err) return res.status(500).send(err);

//     const availableHelpers = [];
//     for (const helper of helpers_) {
//       // Check if the helper has any bookings during the requested time slot
//       const overlappingBookings = await Booking.find({
//         helper: helper._id,
//         date: moment().day(day).toDate(),
//         $or: [
//           { $and: [{ startTime: { $lt: moment(time, 'hh:mm').toDate() } }, { endTime: { $gt: moment(time, 'hh:mm').toDate() } }] },
//           { $and: [{ startTime: { $lt: endTime.toDate() } }, { endTime: { $gt: endTime.toDate() } }] }
//         ]
//       });

//       // If there are no overlapping bookings, add the helper to the list of available helpers
//       if (overlappingBookings.length === 0) {
//         availableHelpers.push(helper);
//       }
//     }

//     const availableHelpersJSON = JSON.stringify(availableHelpers);
//     return res.send(availableHelpersJSON);
//   });
// }
const fs = require("fs");
const path = require("path");
const moment = require("moment");
// const { validationResult } = require('express-validator/check');
const User= require("../models/userModel")
const Helper = require("../models/helperModel");
const Booking = require("../models/bookingModel");

exports.getHelpers = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user.email_verified=false) {
    return res.status(403).send("Email address not verified");
  }
  
  const day = req.query.day;
  const time = req.query.time;
  const duration = req.query.duration;
  const userId = req.userId;

  const start = moment(time, "hh:mm");
  const end = start.clone().add(duration, "minutes");

  Helper.find(
    { ["availability." + day]: { $exists: true } },
    async (err, helpers_) => {
      if (err) return res.status(500).send(err);

      const availableHelpers = [];
      for (let i = 0; i < helpers_.length; i++) {
        const helper = helpers_[i];
        const timeArray = helper.availability[day].split(",");
        const startTime = moment(timeArray[0], "hh:mm");
        const endTime = moment(timeArray[1], "hh:mm");

        if (start.isAfter(startTime) && end.isBefore(endTime)) {
          const existingBookings = await Booking.find({
            helper: helper._id,
            day: day,

            $or: [
              {
                starttime: { $lt: end.toDate() },
                endtime: { $gt: start.toDate() },
              }, // new booking starts during an existing booking
              { starttime: { $gte: start.toDate(), $lt: end.toDate() } }, // new booking starts before an existing booking
              { endtime: { $gt: start.toDate(), $lte: end.toDate() } }, // new booking ends after an existing booking
            ],
          });

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
            availableHelpers.push(helper);
          }
        }
      }
      const availableHelpersJSON = JSON.stringify(availableHelpers);
      return res.send(availableHelpersJSON);
    }
  );
};

