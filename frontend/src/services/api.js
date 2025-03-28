import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const appointmentService = {
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getDoctorAppointments: async (params) => {
    const response = await api.get('/appointments/doctor', { params });
    return response.data;
  },

  getPatientAppointments: async () => {
    const response = await api.get('/appointments/patient');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, statusData) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, statusData);
    return response.data;
  },

  getAppointmentStats: async () => {
    const response = await api.get('/appointments/stats');
    return response.data;
  }
};

export const prescriptionService = {
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  getDoctorPrescriptions: async () => {
    const response = await api.get('/prescriptions/doctor');
    return response.data;
  },

  getPatientPrescriptions: async () => {
    const response = await api.get('/prescriptions/patient');
    return response.data;
  },

  getPrescriptionStats: async () => {
    const response = await api.get('/prescriptions/stats');
    return response.data;
  }
};

export const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  getDoctorProfile: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  updateDoctorProfile: async (profileData) => {
    const response = await api.put('/doctors/profile', profileData);
    return response.data;
  },

  uploadGpayQR: async (formData) => {
    const response = await api.post('/doctors/gpay-qr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadSignature: async (formData) => {
    const response = await api.post('/doctors/signature', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default api;