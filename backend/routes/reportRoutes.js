const express = require('express');
const Inspection = require('../models/Inspection');
const Vehicle = require('../models/Vehicle');
const Inspector = require('../models/Inspector');
const CustomerVehicle = require('../models/CustomerVehicle');
const authMiddleware = require('../middleware/authMiddleware');
const InspectionSummary = require('../services/inspectionSummary');

const router = express.Router();

router.use(authMiddleware);

// Get inspection summary
router.get('/inspection/:vehicleId/summary', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const inspection = await Inspection.findOne({ vehicleId });
    const vehicle = await Vehicle.findById(vehicleId);
    const inspector = await Inspector.findById(req.user.id);

    if (!inspection || !vehicle) {
      return res.status(404).json({ message: 'Inspection or vehicle not found' });
    }

    const summary = new InspectionSummary(inspection, vehicle, {}, inspector);
    const textSummary = summary.generateTextSummary();

    res.status(200).json({
      summary: textSummary,
      inspectionData: inspection,
    });
  } catch (error) {
    next(error);
  }
});

// Download PDF
router.get('/inspection/:vehicleId/pdf', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const inspection = await Inspection.findOne({ vehicleId });
    const vehicle = await Vehicle.findById(vehicleId);
    const inspector = await Inspector.findById(req.user.id);

    if (!inspection || !vehicle) {
      return res.status(404).json({
        message: 'Inspection or vehicle not found'
      });
    }

    const summary = new InspectionSummary(
      inspection,
      vehicle,
      {},
      inspector
    );

    // generatePDF should return the jsPDF document
    const doc = summary.generatePDF();

    // Convert jsPDF document to actual PDF binary
    const pdfArrayBuffer = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="inspection_${vehicleId}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    res.end(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    next(error);
  }
});

module.exports = router;