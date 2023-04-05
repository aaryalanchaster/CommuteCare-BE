const Booking = require("../models/bookingModel");
exports.getPendingRequests = async (req, res, next) => {
    const helperId = req.helperId;
  
    try {
      const bookings = await Booking.find({ helper: helperId, status: 'pending' }).populate('user', 'firstname lastname');

      res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  exports.getCurrentBooking = async (req, res, next) => {
    const userId = req.userId;
  
    try {
      const bookings = await Booking.find({ user: userId,status: { $in: ['pending', 'accepted']}}).populate('helper', 'firstname lastname');

      res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  exports.getConfirmedBooking = async (req, res, next) => {
    const helperId = req.helperId;
  
    try {
      const bookings = await Booking.find({ helper: helperId,status: { $in: ['accepted']}}).populate('user', 'firstname lastname');

      res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  exports.getUserBookingHistory = async (req, res, next) => {
    const userId = req.userId;
  
    try {
      const bookings = await Booking.find({ user: userId,status: { $in: ['pending','completed','rejected']}}).populate('helper', 'firstname lastname');

      return res.send(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };