const express = require('express');
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Эндпоинты для управления пациентами
router.post('/', authMiddleware, createPatient); // Создание пациента
router.get('/', authMiddleware, getPatients); // Получение списка пациентов
router.put('/:id', authMiddleware, updatePatient); // Обновление пациента
router.delete('/:id', authMiddleware, deletePatient); // Удаление пациента

module.exports = router;
