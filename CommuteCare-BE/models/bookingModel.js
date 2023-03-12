const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    day: {
      type: String,
      required: true
    },
    starttime: {
      type: String,
      required: true
    },
    endtime: {
      type: String,
      required: true
    },
    user: {
      type:Schema.Types.ObjectId,
      required:true
    },
    helper: {
      type: Schema.Types.ObjectId,
      ref: 'Helper'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
