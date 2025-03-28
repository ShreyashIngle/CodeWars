import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments/patient', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/prescriptions/patient', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAppointments(appointmentsRes.data);
      setPrescriptions(prescriptionsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Patient Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Upcoming Appointments</h3>
          <div className="space-y-4">
            {appointments
              .filter(
                (apt) =>
                  new Date(apt.appointmentDate) > new Date() &&
                  apt.status !== 'cancelled'
              )
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Dr. {appointment.doctorId.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.type === 'emergency'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(appointment.appointmentDate).toLocaleTimeString()}
                    </div>
                    {appointment.type === 'emergency' && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Appointment
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {appointments.filter(
              (apt) =>
                new Date(apt.appointmentDate) > new Date() &&
                apt.status !== 'cancelled'
            ).length === 0 && (
              <p className="text-gray-500 text-center">
                No upcoming appointments
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Prescriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Recent Prescriptions</h3>
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="border rounded-lg p-4 hover:border-green-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">
                      Dr. {prescription.doctorId.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={prescription.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <FileText className="w-5 h-5" />
                  </a>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">
                      Diagnosis
                    </h5>
                    <p className="text-sm text-gray-600">
                      {prescription.diagnosis}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700">
                      Medicines
                    </h5>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {prescription.medicines.map((medicine, index) => (
                        <li key={index}>
                          {medicine.name} - {medicine.dosage} ({medicine.timing})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {prescription.followUpDate && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Follow-up Date
                      </h5>
                      <p className="text-sm text-gray-600">
                        {new Date(prescription.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && (
              <p className="text-gray-500 text-center">No recent prescriptions</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PatientDashboard;