const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    day: {
      type: String,
      required: true
    },
    date:{
      type:String,
      
    },
    starttime: {
      type: String,
      required: true
    },
    endtime: {
      type: String,
      required: true
    },
    duration:{
      type: Number,
      required:true
    },
    user: {
      type:Schema.Types.ObjectId,
      ref:'User'
    },
    helper: {
      type: Schema.Types.ObjectId,
      ref: 'helpers_1'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected','completed'],
      default: 'pending'
    },
    rating:{
      type:Number
    },
    feedback:{
      type:String
    },
    location:{
      type:String
    },
    description:{
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
