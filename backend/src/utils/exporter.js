const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const XLSX = require('xlsx');
const fs = require('fs');

// Экспорт в PDF
exports.exportToPDF = (data, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text('Patient Medical Records', { align: 'center' });
    doc.moveDown();

    data.forEach((record, index) => {
      doc.fontSize(12).text(`Record ${index + 1}`);
      doc.fontSize(10).text(`Doctor: ${record.doctor}`);
      doc.text(`Notes: ${record.notes}`);
      doc.text(`Created At: ${record.createdAt}`);
      doc.moveDown();
    });

    doc.end();
    resolve(filePath);
  });
};

// Экспорт в DOCX
exports.exportToDOCX = async (data, filePath) => {
  const doc = new Document();

  const heading = new Paragraph({
    children: [new TextRun({ text: 'Patient Medical Records', bold: true, size: 32 })],
  });

  const paragraphs = data.map((record, index) =>
    new Paragraph(
      `${index + 1}. Doctor: ${record.doctor}, Notes: ${record.notes}, Created At: ${record.createdAt}`
    )
  );

  doc.addSection({
    children: [heading, ...paragraphs],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

// Экспорт в XLSX
exports.exportToXLSX = (data, filePath) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
  XLSX.writeFile(workbook, filePath);

  return filePath;
};
