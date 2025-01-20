import express from 'express';
import { createDoctor, getDoctors } from '../controllers/doctor.controller';

const router = express.Router();

router.get('/', getDoctors);    // Получение списка докторов
router.post('/', createDoctor); // Создание доктора

export default router;
