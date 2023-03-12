const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-AuthHelper');
const helperProfileRoute = require('../controllers/helperProfileController');

router.get('/helperProfile',isAuth, helperProfileRoute.getHelperProfile);

module.exports=router;