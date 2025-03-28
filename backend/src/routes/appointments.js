import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', authenticate, appointmentController.createAppointment);
router.get('/doctor', authenticate, appointmentController.getDoctorAppointments);
router.get('/patient', authenticate, appointmentController.getPatientAppointments);
router.put('/:appointmentId/status', authenticate, appointmentController.updateAppointmentStatus);
router.get('/stats', authenticate, appointmentController.getAppointmentStats);

export default router;