import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';

// Create or update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualification,
      experience,
      clinicAddress,
      consultationFee,
      availableSlots
    } = req.body;

    let doctorProfile = await DoctorProfile.findOne({ userId: req.userId });

    if (doctorProfile) {
      doctorProfile.specialization = specialization;
      doctorProfile.qualification = qualification;
      doctorProfile.experience = experience;
      doctorProfile.clinicAddress = clinicAddress;
      doctorProfile.consultationFee = consultationFee;
      doctorProfile.availableSlots = availableSlots;
    } else {
      doctorProfile = new DoctorProfile({
        userId: req.userId,
        specialization,
        qualification,
        experience,
        clinicAddress,
        consultationFee,
        availableSlots
      });
    }

    await doctorProfile.save();
    res.json(doctorProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
  }
};

// Upload GPay QR code
export const uploadGpayQR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No QR code uploaded' });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: req.userId });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctorProfile.gpayQR = `/uploads/${req.file.filename}`;
    await doctorProfile.save();

    res.json({ gpayQR: doctorProfile.gpayQR });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading QR code', error: error.message });
  }
};

// Upload signature
export const uploadSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No signature uploaded' });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: req.userId });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctorProfile.signature = `/uploads/${req.file.filename}`;
    await doctorProfile.save();

    res.json({ signature: doctorProfile.signature });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading signature', error: error.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'enterprise' })
      .select('name email')
      .lean();

    const doctorProfiles = await DoctorProfile.find({
      userId: { $in: doctors.map(d => d._id) }
    }).lean();

    const doctorsWithProfiles = doctors.map(doctor => ({
      ...doctor,
      profile: doctorProfiles.find(p => p.userId.toString() === doctor._id.toString())
    }));

    res.json(doctorsWithProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findById(doctorId)
      .select('name email')
      .lean();

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const profile = await DoctorProfile.findOne({ userId: doctorId }).lean();

    res.json({
      ...doctor,
      profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
  }
};