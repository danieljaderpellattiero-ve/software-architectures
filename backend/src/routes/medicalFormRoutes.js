const express = require('express');
const {
  createMedicalForm,
  getMedicalForms,
  updateMedicalForm,
} = require('../controllers/medicalFormController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Эндпоинты для медицинских форм
router.post('/', authMiddleware, createMedicalForm); // Создание формы
router.get('/', authMiddleware, getMedicalForms); // Получение всех форм
router.put('/:id', authMiddleware, updateMedicalForm); // Обновление формы

module.exports = router;
