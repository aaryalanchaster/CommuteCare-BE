const Helper = require('../models/helperModel');

exports.saveAdditionalDetails = async (req, res, next) => {
    try {
      const helperId = req.helperId;
      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const dob = req.body.dob;
      const mob = req.body.mob;
      const gender = req.body.gender;
      const description = req.body.description;
      const nationality = req.body.nationality;
  
      const helper = await Helper.findById(helperId);
  
      if (!helper) {
        const error = new Error('Helper not found');
        error.statusCode = 404;
        throw error;
      }
  
      helper.firstname = firstname;
      helper.lastname = lastname;
      helper.dob = dob;
      helper.mob = mob;
      helper.gender = gender;
      helper.description = description;
      helper.nationality = nationality;
  
      const updatedHelper = await helper.save();
  
      res.status(200).json({
        message: 'Additional details saved successfully',
        helper: updatedHelper
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  