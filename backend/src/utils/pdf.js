import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export const generatePrescriptionPDF = async (prescription, doctorProfile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const fileName = `prescription_${prescription._id}.pdf`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('Hospital Management System', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('Digital Prescription', { align: 'center' });
      doc.moveDown();

      // Doctor Info
      if (doctorProfile.signature) {
        doc.image(
          path.join(process.cwd(), doctorProfile.signature.substring(1)),
          450,
          doc.y,
          { width: 100 }
        );
      }

      doc.fontSize(12).text(`Dr. ${prescription.doctorId.name}`);
      doc.fontSize(10)
        .text(`${doctorProfile.qualification}`)
        .text(`${doctorProfile.specialization}`)
        .text(`${doctorProfile.clinicAddress}`);
      doc.moveDown();

      // Patient Info
      doc.fontSize(12).text('Patient Details:');
      doc.fontSize(10)
        .text(`Name: ${prescription.patientId.name}`)
        .text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Diagnosis
      doc.fontSize(12).text('Diagnosis:');
      doc.fontSize(10).text(prescription.diagnosis);
      doc.moveDown();

      // Medicines
      doc.fontSize(12).text('Prescribed Medicines:');
      prescription.medicines.forEach(medicine => {
        doc.fontSize(10)
          .text(`• ${medicine.name}`)
          .text(`  Dosage: ${medicine.dosage}`)
          .text(`  Duration: ${medicine.duration}`)
          .text(`  Timing: ${medicine.timing}`);
      });
      doc.moveDown();

      // Instructions
      if (prescription.instructions) {
        doc.fontSize(12).text('Additional Instructions:');
        doc.fontSize(10).text(prescription.instructions);
        doc.moveDown();
      }

      // Follow-up
      if (prescription.followUpDate) {
        doc.fontSize(12).text('Follow-up Date:');
        doc.fontSize(10).text(new Date(prescription.followUpDate).toLocaleDateString());
        doc.moveDown();
      }

      // Payment
      doc.fontSize(12).text('Consultation Fee:');
      doc.fontSize(10).text(`₹${prescription.consultationFee}`);
      doc.moveDown();

      // GPay QR Code
      if (doctorProfile.gpayQR) {
        doc.image(
          path.join(process.cwd(), doctorProfile.gpayQR.substring(1)),
          doc.x,
          doc.y,
          { width: 100 }
        );
        doc.moveDown();
        doc.fontSize(10).text('Scan to pay via GPay', { align: 'left' });
      }

      doc.end();

      writeStream.on('finish', () => {
        resolve(`/uploads/${fileName}`);
      });

      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};