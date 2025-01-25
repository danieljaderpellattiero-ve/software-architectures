const express = require('express');
const {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
  sendRequestToDoctor,
  fillForm,
  updateForm,
  viewForms,
} = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Эндпоинты для управления пациентами
router.post('/', authMiddleware, createPatient); // Создание пациента
router.get('/', authMiddleware, getPatients); // Получение списка пациентов
router.put('/:id', authMiddleware, updatePatient); // Обновление пациента
router.delete('/:id', authMiddleware, deletePatient); // Удаление пациента

// Send request to associate with a doctor
router.post('/request', authMiddleware, sendRequestToDoctor);

// Routes for form handling
router.post('/form', authMiddleware, fillForm);
router.put('/form/:id', authMiddleware, updateForm);
router.get('/forms', authMiddleware, viewForms);

// Route for requesting patient account deletion
router.delete('/:id', authMiddleware, deletePatient);

module.exports = router;
