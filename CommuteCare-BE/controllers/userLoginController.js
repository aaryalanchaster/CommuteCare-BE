const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const loadedUser = await User.findOne({ email: email });

    if (!loadedUser) {
      return res.status(401).json({ message: 'A user with this email could not be found' });
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isEqual) {
      return res.status(401).json({ message: 'Wrong Password' });
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
