const express = require('express');
const router = express.Router();
const userController = require('../controllers/userLoginController');
const helperController = require('../controllers/helperLoginController');


router.post('/userLogin', userController.login);
router.post('/helperLogin', helperController.login);

module.exports = router;