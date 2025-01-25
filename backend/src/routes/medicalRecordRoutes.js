const express = require('express');
const {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require('../controllers/medicalRecordController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Эндпоинты для медицинских записей
router.post('/', authMiddleware, createMedicalRecord); // Создание записи
router.get('/:patientId', authMiddleware, getMedicalRecords); // Получение записей пациента
router.put('/:id', authMiddleware, updateMedicalRecord); // Обновление записи
router.delete('/:id', authMiddleware, deleteMedicalRecord); // Удаление записи

module.exports = router;
