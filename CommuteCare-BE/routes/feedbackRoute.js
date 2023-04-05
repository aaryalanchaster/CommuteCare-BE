const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/submitFeedbackController');

// Route for submitting feedback
router.post('/feedback', feedbackController.submitFeedback);

module.exports = router;
