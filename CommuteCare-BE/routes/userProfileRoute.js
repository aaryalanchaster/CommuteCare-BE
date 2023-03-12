const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const userProfileRoute = require('../controllers/userProfileController');

router.get('/userProfile',isAuth, userProfileRoute.getUserProfile);

module.exports=router;