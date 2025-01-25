const express = require('express');
const router = express.Router();
const { exportMedicalRecords } = require('../controllers/exportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Export medical records of a patient by patientId for admin
router.get('/:patientId', authMiddleware, roleMiddleware('admin'), exportMedicalRecords);

module.exports = router;