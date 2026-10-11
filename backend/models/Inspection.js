const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },

    // Customer account that requested/owns this inspection
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerUser',
      default: null,
    },

    // Inspector who accepted the job
    inspectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspector',
      default: null,
    },

    inspectionDate: {
      type: Date,
      default: Date.now,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    tires: {
      leftFront: String,
      rightFront: String,
      leftRear: String,
      rightRear: String,
    },

    battery: {
      make: String,
      replacementDate: Date,
      voltage: String,
      waterLevel: String,
      damage: String,
      leak: String,
    },

    exterior: {
      rust: String,
      dent: String,
      damage: String,
      damageNotes: String,
      suspensionOilLeak: String,
      images: [String],
    },

    brakes: {
      fluidLevel: String,
      frontCondition: String,
      rearCondition: String,
      emergencyBrakeCondition: String,
      overallSummary: String,
    },

    engine: {
      rust: Boolean,
      dent: Boolean,
      damage: Boolean,
      oilCondition: String,
      oilColour: String,
      brakeFluidCondition: String,
      brakeFluidColour: String,
      oilLeak: Boolean,
    },

    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inspection', inspectionSchema);