import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, X, Check, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error(`Failed to ${newStatus} appointment`);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Appointment Manager</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'confirmed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'emergency'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Emergency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => (
          <motion.div
            key={appointment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {appointment.patientId.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {new Date(appointment.appointmentDate).toLocaleTimeString()}
                </span>
              </div>
              {appointment.type === 'emergency' && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span>Emergency Case</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Symptoms:</h4>
              <p className="text-gray-600">{appointment.symptoms}</p>
            </div>

            {appointment.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Please enter reason for cancellation:');
                    if (reason) {
                      handleStatusChange(appointment._id, 'cancelled', reason);
                    }
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentManager;