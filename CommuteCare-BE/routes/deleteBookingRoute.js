const express = require('express');

const deleteBookingController = require('../controllers/deleteBookingController');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.delete('/delete/:bookingId', isAuth, deleteBookingController.deleteBooking);


module.exports = router;