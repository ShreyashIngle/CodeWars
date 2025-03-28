import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    symptoms: '',
    type: 'regular'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctorId: doctor._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/appointments',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Appointment booked successfully');
      setFormData({
        doctorId: '',
        appointmentDate: '',
        symptoms: '',
        type: 'regular'
      });
      setSelectedDoctor(null);
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Book an Appointment</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor List */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Select Doctor</h3>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleDoctorSelect(doctor)}
                className={`bg-black rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDoctor?._id === doctor._id
                    ? 'border-2 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Dr. {doctor.name}</h4>
                    <p className="text-sm text-gray-500">
                      {doctor.profile?.specialization}
                    </p>
                    <p className="text-sm text-gray-500">
                      Experience: {doctor.profile?.experience} years
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Fee: ₹{doctor.profile?.consultationFee}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Appointment Form */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Appointment Details</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="regular"
                      checked={formData.type === 'regular'}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="mr-2"
                    />
                    Regular
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="emergency"
                      checked={formData.type === 'emergency'}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="mr-2"
                    />
                    Emergency
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>

              {selectedDoctor && (
                <div className="bg-black-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Doctor</h4>
                  <p>Dr. {selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedDoctor.profile?.specialization}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Consultation Fee: ₹{selectedDoctor.profile?.consultationFee}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedDoctor}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;