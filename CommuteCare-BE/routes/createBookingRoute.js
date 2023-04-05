const express = require('express');
const bookingController = require('../controllers/createBookingController');
const isAuthHelper = require('../middleware/is-AuthHelper');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post('/book', isAuth, bookingController.createBooking);

router.post('/accept-booking/:bookingId', isAuthHelper, bookingController.acceptBooking);

router.post('/decline-booking/:bookingId', isAuthHelper, bookingController.declineBooking);

module.exports = router;
