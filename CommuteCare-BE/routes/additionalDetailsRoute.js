const express = require('express');
const router = express.Router();

const { updateUserProfile } = require('../controllers/additionalDetailsUserController');
const { saveAdditionalDetails } = require('../controllers/additionalDetailsHelperController');

const isAuth = require('../middleware/is-auth');
const isAuthHelper = require('../middleware/is-AuthHelper');
// Route for updating additional details of user profile
router.put('/additionaldetails', isAuth,updateUserProfile);

// Route for updating additional details of helper profile
router.put('/additional-details', isAuthHelper, saveAdditionalDetails);

module.exports = router;






