const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
      email:{
        type:String,
      },
      title:{
        type:String,
      },
      detailedDescription:{
        type:String
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Report', bookingSchema);