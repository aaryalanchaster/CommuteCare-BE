const express = require('express');
const { body } = require('express-validator/check');
const Helper = require('../models/helperModel');
const User = require('../models/userModel');
const userController = require('../controllers/userSignupController');
const helperController = require('../controllers/helperSignupController');

const router = express.Router();

router.put(
  '/userSignup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  userController.signup
);
router.put(
  '/helperSignup',
  // [
  //   body('email')
  //     .isEmail()
  //     .withMessage('Please enter a valid email.')
  //     .custom((value, { req }) => {
  //       return Helper.findOne({ email: value }).then(helperDoc => {
  //         if (helperDoc) {
  //           return Promise.reject('E-Mail address already exists!');
  //         }
  //       });
  //     }).
  //     // .normalizeEmail(),
  //   body('password')
  //     .trim()
  //     .isLength({ min: 5 }),
  //   body('name')
  //     .trim()
  //     .not()
  //     .isEmpty()
  // ],
  helperController.signup
);

module.exports = router;