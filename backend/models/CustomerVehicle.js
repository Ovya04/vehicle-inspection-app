const mongoose = require('mongoose');

const customerVehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerUser',
      required: true,
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
    },
    vin: {
      type: String,
      required: [true, 'VIN is required'],
      unique: true,
    },
    color: String,
    mileage: Number,
    imageUrl: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inspecting', 'completed'],
      default: 'pending',
    },
    assignedInspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspector',
    },
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomerVehicle', customerVehicleSchema);