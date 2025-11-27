const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    name: String,
    host: String,
    status: {
      type: String,
      enum: ['registered', 'checked_in', 'checked_out'],
      default: 'registered'
    },
    checkinAt: Date,
    checkoutAt: Date,
    meta: Object
  },
  { timestamps: true }
);

module.exports = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema, 'Visitor');