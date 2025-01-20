import express from 'express';
import { assignDoctor } from '../controllers/patient.controller';

const router = express.Router();

router.post('/assign-doctor', assignDoctor); // Закрепление доктора за пациентом

export default router;
