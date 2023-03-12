const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/userModel');
const verifyOTPController = require('../controllers/verifyOTPController');
const verifyOTPHelperController = require('../controllers/verifyOTPHelperController');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.post('/verifyOTP', verifyOTPController.verifyEmail);
router.post('/verifyOTPHelper', verifyOTPHelperController.verifyEmail);

module.exports = router;