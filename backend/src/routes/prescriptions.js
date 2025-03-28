import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as prescriptionController from '../controllers/prescriptionController.js';

const router = express.Router();

router.post('/', authenticate, prescriptionController.createPrescription);
router.get('/doctor', authenticate, prescriptionController.getDoctorPrescriptions);
router.get('/patient', authenticate, prescriptionController.getPatientPrescriptions);
router.get('/stats', authenticate, prescriptionController.getPrescriptionStats);

export default router;