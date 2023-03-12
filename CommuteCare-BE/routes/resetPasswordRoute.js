const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');
const resetPasswordHelperController=require('../controllers/resetPasswordHelperController')

router.post('/reset-password/:token', resetPasswordController.resetPassword);
router.post('/reset-password/helper/:token', resetPasswordHelperController.resetPassword);

module.exports = router;