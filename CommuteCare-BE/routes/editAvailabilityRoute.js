const express = require('express');

const editAvailabilityController = require('../controllers/editAvailabilityController');
const router = express.Router();

router.put('/editAvailability/:helperId', editAvailabilityController.updateAvailability);

module.exports = router;