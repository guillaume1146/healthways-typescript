const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const personas = require('./test-personas.json');

const outputDir = path.join(__dirname, 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function generateNationalId(persona) {
  return new Promise((resolve, reject) => {
    const slug = slugify(persona.fullName);
    const filePath = path.join(outputDir, `national-id-${slug}.pdf`);
    // A5 landscape: 595.28 x 419.53 (A5 width=419.53, height=595.28, landscape swaps them)
    const doc = new PDFDocument({
      size: 'A5',
      layout: 'landscape',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('REPUBLIC OF MAURITIUS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(13).font('Helvetica-Bold').text('NATIONAL IDENTITY CARD', { align: 'center' });
    doc.moveDown(0.3);

    // Divider line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#333333').lineWidth(1).stroke();
    doc.moveDown(1);

    // Fields
    doc.fontSize(11).font('Helvetica');

    doc.font('Helvetica-Bold').text('Full Name: ', { continued: true });
    doc.font('Helvetica').text(persona.fullName);
    doc.moveDown(0.6);

    doc.font('Helvetica-Bold').text('Date of Birth: ', { continued: true });
    doc.font('Helvetica').text(persona.dob);
    doc.moveDown(0.6);

    doc.font('Helvetica-Bold').text('ID Number: ', { continued: true });
    doc.font('Helvetica').text(persona.idNumber);
    doc.moveDown(0.6);

    doc.font('Helvetica-Bold').text('Nationality: ', { continued: true });
    doc.font('Helvetica').text('Mauritian');
    doc.moveDown(1.5);

    // Footer
    doc.fontSize(8).font('Helvetica').fillColor('#888888')
      .text('This document is issued by the Civil Status Division, Government of Mauritius.', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

function generateProofOfResidence(persona) {
  return new Promise((resolve, reject) => {
    const slug = slugify(persona.fullName);
    const filePath = path.join(outputDir, `proof-of-residence-${slug}.pdf`);
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('CENTRAL ELECTRICITY BOARD', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(13).font('Helvetica-Bold').text('Electricity Bill / Proof of Residence', { align: 'center' });
    doc.moveDown(0.3);

    // Divider line
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#333333').lineWidth(1).stroke();
    doc.moveDown(1.5);

    // Fields
    doc.fontSize(12).font('Helvetica');

    doc.font('Helvetica-Bold').text('Account Holder: ', { continued: true });
    doc.font('Helvetica').text(persona.fullName);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Address: ', { continued: true });
    doc.font('Helvetica').text(persona.address);
    doc.moveDown(0.8);

    const currentDate = new Date().toISOString().split('T')[0];
    doc.font('Helvetica-Bold').text('Date: ', { continued: true });
    doc.font('Helvetica').text(currentDate);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Bill Period: ', { continued: true });
    doc.font('Helvetica').text('January 2026 - February 2026');
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Amount Due: ', { continued: true });
    doc.font('Helvetica').text('Rs 1,250.00');
    doc.moveDown(2);

    // Footer
    doc.fontSize(9).font('Helvetica').fillColor('#888888')
      .text('Central Electricity Board, Royal Road, Curepipe, Mauritius', { align: 'center' });
    doc.moveDown(0.3);
    doc.text('This bill serves as proof of residence for official purposes.', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

function generateProfessionalLicense(persona) {
  return new Promise((resolve, reject) => {
    const slug = slugify(persona.fullName);
    const filePath = path.join(outputDir, `professional-license-${slug}.pdf`);
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('MINISTRY OF HEALTH AND WELLNESS', { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(13).font('Helvetica').text('Republic of Mauritius', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(15).font('Helvetica-Bold').text('PROFESSIONAL LICENSE', { align: 'center' });
    doc.moveDown(0.3);

    // Divider line
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor('#333333').lineWidth(1).stroke();
    doc.moveDown(1.5);

    // Body text
    doc.fontSize(12).font('Helvetica');
    doc.text(
      `This certifies that ${persona.fullName} is licensed to practice as ${persona.profession} in the Republic of Mauritius, in accordance with the Medical Council Act and the relevant regulations governing healthcare professionals.`,
      { lineGap: 4 }
    );
    doc.moveDown(1.2);

    doc.font('Helvetica-Bold').text('License Number: ', { continued: true });
    doc.font('Helvetica').text(persona.licenseNumber);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Full Name: ', { continued: true });
    doc.font('Helvetica').text(persona.fullName);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Profession: ', { continued: true });
    doc.font('Helvetica').text(persona.profession);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Date of Issue: ', { continued: true });
    const currentDate = new Date().toISOString().split('T')[0];
    doc.font('Helvetica').text(currentDate);
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Status: ', { continued: true });
    doc.font('Helvetica').text('Active');
    doc.moveDown(2.5);

    // Signature line
    doc.moveTo(340, doc.y).lineTo(535, doc.y).strokeColor('#333333').lineWidth(0.5).stroke();
    doc.moveDown(0.3);
    doc.fontSize(10).text('Director of Health Services', { align: 'right' });
    doc.moveDown(0.2);
    doc.text('Ministry of Health and Wellness', { align: 'right' });

    // Footer
    doc.moveDown(3);
    doc.fontSize(8).fillColor('#888888')
      .text('Ministry of Health and Wellness, Emmanuel Anquetil Building, Port Louis, Mauritius', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function main() {
  let count = 0;

  for (const persona of personas) {
    await generateNationalId(persona);
    count++;
    await generateProofOfResidence(persona);
    count++;
    await generateProfessionalLicense(persona);
    count++;
  }

  console.log(`Generated ${count} documents successfully`);
}

main().catch((err) => {
  console.error('Error generating documents:', err);
  process.exit(1);
});
