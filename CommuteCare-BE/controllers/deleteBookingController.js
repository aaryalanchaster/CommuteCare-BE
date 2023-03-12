//const Helper = require("../models/helperModel");
const Booking = require("../models/bookingModel");

exports.deleteBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const userId = req.userId;
  
    const booking = await Booking.findById(bookingId);
  
    if (!booking) {
      return res.status(404).send("Booking not found.");
    }
  
    if (booking.user.toString() !== userId) {
      return res.status(403).send("You are not authorized to delete this booking.");
    }
  
    await booking.remove((err) => {
      if (err) return res.status(500).send(err);
      return res.send("Booking deleted successfully.");
    });
  };
  