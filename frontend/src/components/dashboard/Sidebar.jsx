import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Leaf, MessageSquare, Newspaper, Map, GanttChart, FileText, Cloud, BookOpen, Calendar, Clock, Activity, Stethoscope, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const menuConfig = {
    farmer: [
      // { icon: BookOpen, label: 'DSA Sheet', path: '/dashboard/dsa-sheet' },
      // { icon: Calendar, label: 'Placement Calendar', path: '/dashboard/placement-calendar' },
      // { icon: Clock, label: 'Sessions', path: '/dashboard/sessions' },
      { 
        icon: Stethoscope, 
        label: 'Book Appointment', 
        path: '/dashboard/book-appointment',
        description: 'Schedule medical appointments with doctors'
      },
      { 
        icon: ClipboardList, 
        label: 'Patient Dashboard', 
        path: '/dashboard/patient-dashboard',
        description: 'View your appointments and medical history'
      }
    ],
    enterprise: [
      // { icon: BookOpen, label: 'DSA Sheet', path: '/dashboard/dsa-sheet' },
      // { icon: Calendar, label: 'Placement Calendar', path: '/dashboard/placement-calendar' },
      // { icon: Clock, label: 'Sessions', path: '/dashboard/sessions' },
      { 
        icon: Activity, 
        label: 'Doctor Dashboard', 
        path: '/dashboard/doctor-dashboard',
        description: 'Overview of appointments and patient statistics'
      },
      { 
        icon: MessageSquare, 
        label: 'Appointment Manager', 
        path: '/dashboard/appointment-manager',
        description: 'Manage and track patient appointments'
      },
      { 
        icon: FileText, 
        label: 'Prescription Generator', 
        path: '/dashboard/prescription-generator',
        description: 'Create and manage digital prescriptions'
      }
    ]
  };

  const menuItems = menuConfig[userRole] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-72 bg-gray-900 h-full fixed left-0 top-20 p-6 z-40 shadow-xl"
          >
            <div className="flex justify-end md:hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {menuItems.map((item) => {
                const isCurrentActive = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                    className={`flex flex-col p-4 rounded-xl transition-all ${
                      isCurrentActive
                        ? 'bg-blue-800 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && window.innerWidth < 768 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}

export default Sidebar;