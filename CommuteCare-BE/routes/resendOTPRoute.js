const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/userModel');
const resendOTPController = require('../controllers/resendOTPController');
const resendOTPHelperController = require('../controllers/resendOTPHelperController');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.post('/resendOTP', resendOTPController.resendOtp);
router.post('/resendOTPHelper', resendOTPHelperController.resendOtp);

module.exports = router;