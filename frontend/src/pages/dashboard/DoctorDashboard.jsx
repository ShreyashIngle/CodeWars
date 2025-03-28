import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Activity, DollarSign } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import toast from 'react-hot-toast';

function DoctorDashboard() {
  const [stats, setStats] = useState({
    appointments: {
      total: 0,
      pending: 0,
      confirmed: 0,
      emergency: 0
    },
    revenue: {
      total: 0,
      monthly: []
    }
  });

  const [appointments, setAppointments] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [appointmentsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/appointments/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAppointments(appointmentsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const appointmentChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Appointments',
        data: stats.monthlyStats?.map(stat => stat.count) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const revenueChartData = {
    labels: stats.revenue.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats.revenue.monthly.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Appointments</p>
              <h3 className="text-2xl font-bold">{stats.appointments.total}</h3>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">{stats.appointments.pending}</h3>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Emergency</p>
              <h3 className="text-2xl font-bold">{stats.appointments.emergency}</h3>
            </div>
            <Activity className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.revenue.total}</h3>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Appointment Trends</h3>
          <Line
            data={appointmentChartData}
            options={{ responsive: true }}
            redraw
          />
          <Bar
            data={revenueChartData}
            options={{ responsive: true }}
            redraw
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Revenue Analysis</h3>
          <Bar data={revenueChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientId.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientId.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default DoctorDashboard;