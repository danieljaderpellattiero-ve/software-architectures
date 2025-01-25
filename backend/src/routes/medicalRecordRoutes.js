const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createMedicalRecord, getMedicalRecords } = require('../controllers/medicalRecordController');

// Routes
router.post('/', authMiddleware, createMedicalRecord);
router.get('/', authMiddleware, getMedicalRecords);

module.exports = router;
