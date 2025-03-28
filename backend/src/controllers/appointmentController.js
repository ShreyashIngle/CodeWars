import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { sendAppointmentEmail } from '../utils/email.js';

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, symptoms, type } = req.body;
    
    // Validate doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'enterprise' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patientId: req.userId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      symptoms,
      type,
      status: type === 'emergency' ? 'emergency' : 'pending'
    });

    await appointment.save();

    // Send email notification to doctor
    await sendAppointmentEmail(doctor.email, {
      type: 'new',
      appointmentDate,
      patientName: req.user.name
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Get appointments for doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = { doctorId: req.userId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get appointments for patient
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.userId })
      .populate('doctorId', 'name email')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, reason } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patientId', 'email name')
      .populate('doctorId', 'email name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (reason) {
      appointment.cancelReason = reason;
    }

    await appointment.save();

    // Send email notification
    await sendAppointmentEmail(appointment.patientId.email, {
      type: status,
      appointmentDate: appointment.appointmentDate,
      doctorName: appointment.doctorId.name,
      reason
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

// Get appointment statistics
export const getAppointmentStats = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $match: {
          doctorId: req.userId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Appointment.aggregate([
      {
        $match: {
          doctorId: req.userId,
          appointmentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$appointmentDate' },
            year: { $year: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    res.json({ stats, monthlyStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};