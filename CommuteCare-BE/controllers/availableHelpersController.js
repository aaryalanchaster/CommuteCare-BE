const fs = require("fs");
const path = require("path");
const moment = require("moment");
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
        const timeArray = helper.availability[day].split("");
        const startTime = moment(timeArray.slice(0, 5).join(""), "hh:mm");
        const endTime = moment(timeArray.slice(5).join(""), "hh:mm")

        if (start.isAfter(startTime) && end.isBefore(endTime)) {
          const existingBookings = await Booking.find({
            helper: helper._id,
            day: day,
            status: { $ne: "completed" },
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

