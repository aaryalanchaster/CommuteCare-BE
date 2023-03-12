const express = require('express');
//const { body } = require('express-validator/check');

const bookingController = require('../controllers/createBookingController');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
//const moment= require("moment");

// let rand = Math.random()
// console.log(rand)
// if (rand > 0.5) {

// router.post('/book', isAuth, bookingController.createBooking);
// }
// else{
//     router.post('/book', isAuth, bookingController.declinedbooking);
// }

router.post('/book', isAuth, (req, res) => {
    const rand = Math.random();
    console.log(rand);
    if (rand > 0.5) {
      bookingController.createBooking(req, res);
    } else {
      bookingController.declinedbooking(req, res);
    }
  });
  


module.exports = router;