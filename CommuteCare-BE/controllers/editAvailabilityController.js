const Helper=require('../models/helperModel')

exports.updateAvailability = async (req, res, next) => {
    const helperId = req.params.helperId;
    const updatedAvailability = req.body;
  //console.log(req.body);
 
  
    
      const helper = await Helper.findById(helperId);
      
      if (!helper) {
        return res.status(404).json({ message: "Helper not found" });
      }
      if (helper.email_verified===false) {
        return res.status(403).json({message: "Email address not verified"});
      }
      // Update the availability of the helper
      else{
      helper.availability = updatedAvailability;
  
      // Save the updated helper to the database
      await helper.save();
  
      return res.status(200)({ message: "Availability updated successfully" });}
    
  };
  