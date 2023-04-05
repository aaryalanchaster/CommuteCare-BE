const express = require('express');

const editAvailabilityController = require('../controllers/editAvailabilityController');
const router = express.Router();

router.put('/editAvailability/:helperId', editAvailabilityController.updateAvailability);
router.get('/getAvailability/:helperId', editAvailabilityController.getAvailability);

module.exports = router;