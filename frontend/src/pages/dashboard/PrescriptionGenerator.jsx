import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, FileText, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';

function PrescriptionGenerator() {
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '', timing: '' }],
    instructions: '',
    followUpDate: '',
    consultationFee: ''
  });

  const [loading, setLoading] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState(null);

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: '', dosage: '', duration: '', timing: '' }
      ]
    });
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = formData.medicines.map((medicine, i) => {
      if (i === index) {
        return { ...medicine, [field]: value };
      }
      return medicine;
    });
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/prescriptions',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGeneratedPrescription(response.data);
      toast.success('Prescription generated successfully');
    } catch (error) {
      toast.error('Failed to generate prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Prescription Generator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment ID
              </label>
              <input
                type="text"
                value={formData.appointmentId}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosis: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Medicines
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {formData.medicines.map((medicine, index) => (
                <div key={index} className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Medicine #{index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, 'name', e.target.value)
                      }
                      placeholder="Medicine Name"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, 'dosage', e.target.value)
                      }
                      placeholder="Dosage"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, 'duration', e.target.value)
                      }
                      placeholder="Duration"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.timing}
                      onChange={(e) =>
                        handleMedicineChange(index, 'timing', e.target.value)
                      }
                      placeholder="Timing"
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) =>
                    setFormData({ ...formData, followUpDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Prescription
                </>
              )}
            </button>
          </form>
        </motion.div>

        {generatedPrescription && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Generated Prescription</h3>
              <a
                href={generatedPrescription.pdfUrl}
                download
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>

            <div className="border-t pt-6">
              <div className="mb-6">
                <QRCode
                  value={`upi://pay?pa=${generatedPrescription.doctorId.upiId}&pn=Dr.${
                    generatedPrescription.doctorId.name
                  }&am=${
                    generatedPrescription.consultationFee
                  }&cu=INR&tn=Consultation Fee`}
                  size={128}
                  className="mx-auto"
                />
                <p className="text-center mt-2 text-sm text-gray-600">
                  Scan to pay ₹{generatedPrescription.consultationFee}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Diagnosis</h4>
                  <p>{generatedPrescription.diagnosis}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Medicines</h4>
                  <ul className="list-disc pl-5">
                    {generatedPrescription.medicines.map((medicine, index) => (
                      <li key={index}>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-gray-600">
                          {medicine.dosage} - {medicine.timing} for{' '}
                          {medicine.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {generatedPrescription.instructions && (
                  <div>
                    <h4 className="font-medium text-gray-700">Instructions</h4>
                    <p>{generatedPrescription.instructions}</p>
                  </div>
                )}

                {generatedPrescription.followUpDate && (
                  <div>
                    <h4 className="font-medium text-gray-700">Follow-up Date</h4>
                    <p>
                      {new Date(
                        generatedPrescription.followUpDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionGenerator;