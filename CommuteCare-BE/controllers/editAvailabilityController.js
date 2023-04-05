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
  
    return res.status(200).json({ message: "Availability updated successfully" })
      }
  };
  exports.getAvailability = async (req, res, next) => {
    const helperId = req.params.helperId;
    
    try {
        const helper = await Helper.findById(helperId);
        
        if (!helper) {
            return res.status(404).json({ message: "Helper not found" });
        }
        
        return res.status(200).json({ availability: helper.availability });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
