const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Helper = require('../models/helperModel');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedHelper;
    Helper.findOne({ email: email })
      .then(helper => {
        if (!helper) {
          return res.status(401).json({message:'A helper with this email could not be found'});
        }
        loadedHelper = helper;
        return bcrypt.compare(password, helper.password);
      })
      .then(isEqual => {
        if (!isEqual) {
          return res.status(401).json({message:'Wrong Password'});
        }
        const token = jwt.sign(
          {
            email: loadedHelper.email,
            helperId: loadedHelper._id.toString()
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, helperId: loadedHelper._id.toString() });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  