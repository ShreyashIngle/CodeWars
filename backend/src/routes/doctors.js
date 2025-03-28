import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as doctorController from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', authenticate, doctorController.getAllDoctors);
router.get('/:doctorId', authenticate, doctorController.getDoctorProfile);
router.put('/profile', authenticate, doctorController.updateDoctorProfile);
router.post('/gpay-qr', authenticate, (req, res, next) => {
  req.upload.single('qr')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, doctorController.uploadGpayQR);
router.post('/signature', authenticate, (req, res, next) => {
  req.upload.single('signature')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, doctorController.uploadSignature);

export default router;