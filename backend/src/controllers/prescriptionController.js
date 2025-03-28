import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import { generatePrescriptionPDF } from '../utils/pdf.js';
import { sendPrescriptionEmail } from '../utils/email.js';

// Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
      consultationFee
    } = req.body;

    // Get doctor's profile for QR code and signature
    const doctorProfile = await DoctorProfile.findOne({ userId: req.userId });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescription = new Prescription({
      patientId,
      doctorId: req.userId,
      appointmentId,
      diagnosis,
      medicines,
      instructions,
      followUpDate,
      consultationFee
    });

    await prescription.save();

    // Generate PDF
    const pdfUrl = await generatePrescriptionPDF(prescription, doctorProfile);
    prescription.pdfUrl = pdfUrl;
    await prescription.save();

    // Update appointment status
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });
    }

    // Send email to patient
    await sendPrescriptionEmail(prescription.patientId.email, {
      doctorName: req.user.name,
      pdfUrl,
      consultationFee
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
};

// Get prescriptions for doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.userId })
      .populate('patientId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get prescriptions for patient
export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.userId })
      .populate('doctorId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get prescription statistics
export const getPrescriptionStats = async (req, res) => {
  try {
    const monthlyRevenue = await Prescription.aggregate([
      {
        $match: {
          doctorId: req.userId,
          paymentStatus: 'completed',
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: '$consultationFee' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const commonDiagnoses = await Prescription.aggregate([
      {
        $match: {
          doctorId: req.userId
        }
      },
      {
        $group: {
          _id: '$diagnosis',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({ monthlyRevenue, commonDiagnoses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};