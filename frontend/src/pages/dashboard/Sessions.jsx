import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    meetLink: ''
  });
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    fetchSessions();
    // Set up interval to check for expired sessions
    const interval = setInterval(fetchSessions, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingSession) {
        await axios.put(
          `http://localhost:5000/api/sessions/${editingSession._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Session updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/sessions',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Session created successfully');
      }
      setIsModalOpen(false);
      setEditingSession(null);
      setFormData({
        title: '',
        description: '',
        dateTime: '',
        meetLink: ''
      });
      fetchSessions();
    } catch (error) {
      toast.error(editingSession ? 'Failed to update session' : 'Failed to create session');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      dateTime: new Date(session.dateTime).toISOString().slice(0, 16),
      meetLink: session.meetLink
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-bold">Sessions</h1>
        <button
          onClick={() => {
            setEditingSession(null);
            setFormData({
              title: '',
              description: '',
              dateTime: '',
              meetLink: ''
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{session.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="p-2 hover:bg-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{session.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>{new Date(session.dateTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>{new Date(session.dateTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <LinkIcon className="w-5 h-5" />
                <a
                  href={session.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingSession ? 'Edit Session' : 'Create Session'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.meetLink}
                  onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSession ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Sessions;