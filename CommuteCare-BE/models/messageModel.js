const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userId: { type: String, required: true },
  helperId: { type: String, required: true },
  booking:{type:Schema.Types.ObjectId, ref:'Booking'},
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: {
    type: String,
    enum: ['user', 'helper'],
    required: true
  }
});


module.exports= mongoose.model("Messages", MessageSchema);
