const { jsPDF } = require('jspdf');

class InspectionSummary {
  constructor(inspection, vehicle, customer, inspector) {
    this.inspection = inspection;
    this.vehicle = vehicle;
    this.customer = customer;
    this.inspector = inspector;
  }

  generateTextSummary() {
    const summary = [];
    summary.push('=== VEHICLE INSPECTION REPORT ===\n');
    summary.push(`Date: ${new Date(this.inspection.createdAt).toLocaleDateString()}\n`);
    summary.push(`Inspector: ${this.inspector.name}\n`);
    summary.push(`Vehicle: ${this.vehicle.make} ${this.vehicle.model} (${this.vehicle.year})\n`);
    summary.push(`VIN: ${this.vehicle.vin}\n`);
    summary.push(`Mileage: ${this.vehicle.mileage} km\n`);
    summary.push(`\n--- INSPECTION DETAILS ---\n`);

    if (this.inspection.tires) {
      summary.push(`Tires:\n`);
      summary.push(`  Left Front: ${this.inspection.tires.leftFront || 'N/A'}\n`);
      summary.push(`  Right Front: ${this.inspection.tires.rightFront || 'N/A'}\n`);
      summary.push(`  Left Rear: ${this.inspection.tires.leftRear || 'N/A'}\n`);
      summary.push(`  Right Rear: ${this.inspection.tires.rightRear || 'N/A'}\n`);
    }

    if (this.inspection.battery) {
      summary.push(`\nBattery:\n`);
      summary.push(`  Make: ${this.inspection.battery.make || 'N/A'}\n`);
      summary.push(`  Voltage: ${this.inspection.battery.voltage || 'N/A'}\n`);
      summary.push(`  Water Level: ${this.inspection.battery.waterLevel || 'N/A'}\n`);
    }

    if (this.inspection.brakes) {
      summary.push(`\nBrakes:\n`);
      summary.push(`  Fluid Level: ${this.inspection.brakes.fluidLevel || 'N/A'}\n`);
      summary.push(`  Front: ${this.inspection.brakes.frontCondition || 'N/A'}\n`);
      summary.push(`  Rear: ${this.inspection.brakes.rearCondition || 'N/A'}\n`);
    }

    if (this.inspection.engine) {
      summary.push(`\nEngine:\n`);
      summary.push(`  Oil Condition: ${this.inspection.engine.oilCondition || 'N/A'}\n`);
      summary.push(`  Oil Color: ${this.inspection.engine.oilColour || 'N/A'}\n`);
    }

    summary.push(`\nStatus: ${this.inspection.status}\n`);
    summary.push(`\n=== END OF REPORT ===\n`);

    return summary.join('');
  }

  generatePDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20;

    // Title
    doc.setFontSize(18);
    doc.text('VEHICLE INSPECTION REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Header Info
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(this.inspection.createdAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Inspector: ${this.inspector.name}`, margin, yPosition);
    yPosition += 10;

    // Vehicle Info
    doc.setFontSize(12);
    doc.text('Vehicle Information', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(`Make & Model: ${this.vehicle.make} ${this.vehicle.model}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Year: ${this.vehicle.year}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`VIN: ${this.vehicle.vin}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Mileage: ${this.vehicle.mileage} km`, margin + 5, yPosition);
    yPosition += 12;

    // Inspection Details
    doc.setFontSize(12);
    doc.text('Inspection Details', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(9);

    if (this.inspection.tires) {
      doc.text('Tires:', margin + 5, yPosition);
      yPosition += 5;
      doc.text(
        `Left Front: ${this.inspection.tires.leftFront || 'N/A'} | Right Front: ${this.inspection.tires.rightFront || 'N/A'}`,
        margin + 10,
        yPosition
      );
      yPosition += 5;
      doc.text(
        `Left Rear: ${this.inspection.tires.leftRear || 'N/A'} | Right Rear: ${this.inspection.tires.rightRear || 'N/A'}`,
        margin + 10,
        yPosition
      );
      yPosition += 8;
    }

    if (this.inspection.battery) {
      doc.text(`Battery - Make: ${this.inspection.battery.make || 'N/A'}, Voltage: ${this.inspection.battery.voltage || 'N/A'}`, margin + 5, yPosition);
      yPosition += 6;
    }

    if (this.inspection.brakes) {
      doc.text(
        `Brakes - Fluid: ${this.inspection.brakes.fluidLevel || 'N/A'}, Front: ${this.inspection.brakes.frontCondition || 'N/A'}, Rear: ${this.inspection.brakes.rearCondition || 'N/A'}`,
        margin + 5,
        yPosition
      );
      yPosition += 8;
    }

    if (this.inspection.engine) {
      doc.text(`Engine Oil - Condition: ${this.inspection.engine.oilCondition || 'N/A'}, Color: ${this.inspection.engine.oilColour || 'N/A'}`, margin + 5, yPosition);
      yPosition += 8;
    }

    // Status
    yPosition += 5;
    doc.setFontSize(11);
    doc.text(`Status: ${this.inspection.status}`, margin, yPosition);

    return doc;
  }
}

module.exports = InspectionSummary;