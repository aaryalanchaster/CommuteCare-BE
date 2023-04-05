const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.post('/report',isAuth,reportController.report);

module.exports = router;