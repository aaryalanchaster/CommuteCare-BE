const Booking = require("../models/bookingModel");
const Helper = require("../models/helperModel");

exports.submitFeedback = async (req, res, next) => {
    const { bookingId, rating, feedback } = req.body;
    const userId= req.userId
  
    try {
    const booking = await Booking.findById(bookingId).populate("helper");
    if (booking.rating !== null) {
      return res.status(400).send("You have already rated this booking");
    }
    if (rating <= 0) {
      return res.status(400).send("Rating must be greater than zero");
  }

    // Update the booking with the rating and feedback
    booking.rating = rating;
    booking.feedback = feedback;
    await booking.save();
  
      // Calculate the new average rating for the helper
      const helper = booking.helper;
      const bookings = await Booking.find({
        helper: helper._id,
        status: "completed",
        rating: { $ne: null },
      });
      const numBookings = bookings.length;
      const totalRating = bookings.reduce((acc, curr) => acc + (typeof curr.rating === 'number' && !isNaN(curr.rating) ? curr.rating : 0), 0);
      const avgRating = totalRating / numBookings;
  
      // Update the booking helper with the new average rating
      helper.rating = avgRating;
      await helper.save();
  
      // Update the helper model with the new rating
      const helperId = helper._id;
      await Helper.findByIdAndUpdate(
        helperId,
        { $set: { rating: avgRating } },
        { new: true }
      );
  
      res.send({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };