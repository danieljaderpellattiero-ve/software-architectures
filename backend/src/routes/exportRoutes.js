const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Log = require('../models/Log');
const exportToPDF = require('../utils/pdfExporter');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Export users to PDF
router.get('/users/pdf', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().lean();

    const headers = ['Name', 'Email', 'Role'];
    const filePath = 'exports/users.pdf';

    exportToPDF(filePath, 'Users List', headers, users);

    res.download(filePath); // Отправка файла на клиент
  } catch (error) {
    res.status(500).json({ message: 'Error exporting users to PDF', error: error.message });
  }
});

// Export logs to PDF
router.get('/logs/pdf', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const logs = await Log.find().lean();

    const headers = ['UserId', 'Action', 'Resource', 'ResourceId', 'Timestamp'];
    const filePath = 'exports/logs.pdf';

    exportToPDF(filePath, 'Logs List', headers, logs);

    res.download(filePath); // Отправка файла на клиент
  } catch (error) {
    res.status(500).json({ message: 'Error exporting logs to PDF', error: error.message });
  }
});

module.exports = router;
