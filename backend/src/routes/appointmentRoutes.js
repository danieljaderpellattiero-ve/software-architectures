const express = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware'); // Импорт middleware для авторизации

const router = express.Router();

// Маршруты для управления записями
router.post('/', authMiddleware, createAppointment); // Создание запроса
router.get('/', authMiddleware, getAppointments); // Получение всех записей
router.put('/:id', authMiddleware, updateAppointmentStatus); // Обновление статуса
router.delete('/:id', authMiddleware, deleteAppointment); // Удаление записи

module.exports = router;
