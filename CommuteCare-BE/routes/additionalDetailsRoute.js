const express = require('express');
const router = express.Router();

const { updateUserProfile } = require('../controllers/additionalDetailsUserController');
const { saveAdditionalDetails } = require('../controllers/additionalDetailsHelperController');
const upload=require('../middleware/upload')
const uploadUser=require('../middleware/uploadUser')
const isAuth = require('../middleware/is-auth');
const isAuthHelper = require('../middleware/is-AuthHelper');

// Route for updating additional details of user profile
router.post('/additionaldetails',uploadUser.single('profilePhoto'), isAuth,updateUserProfile);

// Route for updating additional details of helper profile
router.post('/additional-details',upload.single('profilePhoto'), isAuthHelper, saveAdditionalDetails);

module.exports = router;






