// Get user profile route

const Helper = require('../models/helperModel');
exports.getHelperProfile = async (req, res, next) => {
    try {
      const helperId = req.helperId;
  
      const helper = await Helper.findById(helperId);
      console.log(helper)
  
      if (!helper) {
        const error = new Error('Helper not found');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        message: 'Helper profile retrieved successfully',
        helper: helper
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  