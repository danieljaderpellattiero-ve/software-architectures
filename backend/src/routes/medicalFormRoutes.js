const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createMedicalForm, getMedicalForms } = require('../controllers/medicalFormController');

// Routes
router.post('/', authMiddleware, createMedicalForm);
router.get('/', authMiddleware, getMedicalForms);

module.exports = router;
