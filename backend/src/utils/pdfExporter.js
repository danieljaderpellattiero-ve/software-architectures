const PDFDocument = require('pdfkit');
const fs = require('fs');

const exportToPDF = (filePath, title, headers, data) => {
  const doc = new PDFDocument();

  // Создаем поток записи в файл
  doc.pipe(fs.createWriteStream(filePath));

  // Заголовок
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();

  // Таблица заголовков
  doc.fontSize(12);
  headers.forEach((header) => {
    doc.text(header, { continued: true, width: 100 });
  });
  doc.moveDown();

  // Данные
  data.forEach((row) => {
    headers.forEach((header) => {
      doc.text(row[header.toLowerCase()], { continued: true, width: 100 });
    });
    doc.moveDown();
  });

  // Завершаем создание документа
  doc.end();
};

module.exports = exportToPDF;
