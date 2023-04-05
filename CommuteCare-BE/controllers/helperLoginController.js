const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Helper = require('../models/helperModel');

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const loadedHelper = await Helper.findOne({ email: email });

    if (!loadedHelper) {
      return res.status(401).json({ message: 'A helper with this email could not be found' });
    }

    const isEqual = await bcrypt.compare(password, loadedHelper.password);

    if (!isEqual) {
      return res.status(401).json({ message: 'Wrong Password' });
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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
