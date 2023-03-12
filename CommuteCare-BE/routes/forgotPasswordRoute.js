const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');
const forgotPasswordHelperController = require('../controllers/forgotPasswordHelperController');

router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/forgot-password/helper', forgotPasswordHelperController.forgotPassword);

module.exports = router;