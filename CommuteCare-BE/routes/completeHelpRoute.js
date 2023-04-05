const express = require('express');
const router = express.Router();
const completeHelpController = require('../controllers/completeHelpController');
const authMiddleware = require('../middleware/is-AuthHelper');

// POST /helpers/complete
router.post('/complete-help', authMiddleware, completeHelpController.completeHelp);

module.exports = router;