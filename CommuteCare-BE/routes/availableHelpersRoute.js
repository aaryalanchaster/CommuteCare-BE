const express = require('express');
//const { body } = require('express-validator/check');

const availableHelperController = require('../controllers/availableHelpersController');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
//const moment= require("moment");

router.get('/availableHelpers',isAuth, availableHelperController.getHelpers);



module.exports = router;