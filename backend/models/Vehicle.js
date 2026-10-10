const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Please provide customer ID'],
    },
    make: {
      type: String,
      required: [true, 'Please provide vehicle make'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide vehicle model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide vehicle year'],
    },
    vin: {
      type: String,
      required: [true, 'Please provide VIN'],
      unique: true,
      trim: true,
    },
    color: {
      type: String,
    },
    mileage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);