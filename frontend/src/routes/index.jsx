import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import ForgotPassword from '../pages/ForgotPassword';
import DoctorDashboard from '../pages/dashboard/DoctorDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import BookAppointment from '../pages/dashboard/BookAppointment';
import AppointmentManager from '../pages/dashboard/AppointmentManager';
import PrescriptionGenerator from '../pages/dashboard/PrescriptionGenerator';
import DsaSheet from '../pages/dashboard/DsaSheet';
import Sessions from '../pages/dashboard/Sessions';
import PlacementCalendar from '../pages/dashboard/PlacementCalendar';

const ProtectedRoute = ({ children, allowedRoles = ['farmer', 'enterprise'] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if (!allowedRoles.includes(userRole || '')) {
  //   return <Navigate to="/dashboard/dsa-sheet" replace />;
  // }


  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'contact', element: <Contact /> },
      { 
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        children: [
          { index: true, element: <Navigate to="dsa-sheet" replace /> },
          {
            path: 'dsa-sheet',
            element: <ProtectedRoute allowedRoles={['enterprise']}><DsaSheet /></ProtectedRoute>
          },
          {
            path: 'doctor-dashboard',
            element: <ProtectedRoute allowedRoles={['enterprise']}><DoctorDashboard /></ProtectedRoute>
          },
          {
            path: 'patient-dashboard',
            element: <ProtectedRoute allowedRoles={['farmer']}><PatientDashboard /></ProtectedRoute>
          },
          {
            path:'book-appointment',
            element: <ProtectedRoute allowedRoles={['farmer']}><BookAppointment /></ProtectedRoute>
          },
          {
            path: 'appointment-manager',
            element: <ProtectedRoute allowedRoles={['enterprise']}><AppointmentManager /></ProtectedRoute>
          },
          {
            path: 'prescription-generator',
            element: <ProtectedRoute allowedRoles={['enterprise']}><PrescriptionGenerator /></ProtectedRoute>
          },
          {
            path: 'sessions',
            element: <ProtectedRoute allowedRoles={['enterprise']}><Sessions /></ProtectedRoute>
          },
          {
            path: 'placement-calendar',
            element: <ProtectedRoute allowedRoles={['enterprise']}><PlacementCalendar /></ProtectedRoute>
          }
        ]
      },
      { 
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { 
        path: 'settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> }
    ]
  }
]);
