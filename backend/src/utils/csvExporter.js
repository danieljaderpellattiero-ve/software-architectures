const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const exportToCSV = async (filePath, headers, data) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
  });

  try {
    await csvWriter.writeRecords(data);
    console.log(`Data successfully exported to ${filePath}`);
  } catch (error) {
    console.error('Error exporting data to CSV:', error.message);
  }
};

module.exports = exportToCSV;
