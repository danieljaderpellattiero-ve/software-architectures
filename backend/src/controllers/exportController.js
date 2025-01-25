const MedicalRecord = require('../models/MedicalRecord');
const { exportToPDF, exportToDocx, exportToXlsx } = require('../utils/pdfExporter');

exports.exportMedicalRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    const records = await MedicalRecord.find({ patient: id });

    if (!records.length) {
      return res.status(404).json({ message: 'No medical records found' });
    }

    let filePath;
    if (format === 'pdf') filePath = await exportToPDF(records);
    if (format === 'docx') filePath = await exportToDocx(records);
    if (format === 'xlsx') filePath = await exportToXlsx(records);

    res.download(filePath);
  } catch (error) {
    console.error('Error exporting medical records:', error.message);
    res.status(500).json({ error: error.message });
  }
};
