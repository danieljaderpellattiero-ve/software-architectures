import express from 'express';
import { login } from '../controllers/auth.controller'; // Если экспорт именованный

const router = express.Router();

// Подключение маршрута
router.post('/login', login);

export default router;
