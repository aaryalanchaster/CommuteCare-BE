const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helperSchema = new Schema(
  {
      firstname:{
        type: String,
       
      },
      lastname:{
      type: String,
      
    },
    password:{
        type:String,
       
    },
    dob: {
      type: String,
      default:'' 
    },
    email: {
      type: String,
      required: true
    },
    mob: {
      type: String,
      default:''
    },
    gender: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      default: 0
    },
    nationality:{
      type:String,
    },
    helped: {
      type: Number,
      default: 0
    },
    email_verified:{
        type:Boolean,
        default:false
    },
    helperId:{
        type:Schema.Types.ObjectId,
        ref:'Helper'
    },
    description:{
      type: String,
      default: ''
    },
   availability: {
    Monday: {
      type: String,
      default: ""
    },
    Tuesday: {
      type: String,
      default: ""
    },
    Wednesday: {
      type: String,
      default: ""
    },
    Thursday: {
      type: String,
      default: ""
    },
    Friday: {
      type: String,
      default: ""
    },
    Saturday: {
      type: String,
      default: ""
    },
    Sunday: {
      type: String,
      default: ""
    }
  },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('helpers_1', helperSchema);