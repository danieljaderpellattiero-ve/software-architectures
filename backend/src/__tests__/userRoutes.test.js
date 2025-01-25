const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let doctorToken, patientId, recordId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const doctorId = new mongoose.Types.ObjectId();
  patientId = new mongoose.Types.ObjectId();

  doctorToken = jwt.sign({ id: doctorId, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('MedicalRecord API', () => {
  it('should create a medical record', async () => {
    const res = await request(app)
      .post('/api/medical-records')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        patient: patientId,
        notes: 'Patient diagnosed with hypertension.',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.medicalRecord).toHaveProperty('_id');
    recordId = res.body.medicalRecord._id;
  }, 10000); // Увеличиваем таймаут до 10 секунд
  

  it('should fetch medical records for a patient', async () => {
    const res = await request(app)
      .get(`/api/medical-records/${patientId}`)
      .set('Authorization', `Bearer ${doctorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.medicalRecords.length).toBeGreaterThan(0);
  });

  it('should update a medical record', async () => {
    const res = await request(app)
      .put(`/api/medical-records/${recordId}`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ notes: 'Updated notes for the patient.' });
    expect(res.statusCode).toBe(200);
    expect(res.body.medicalRecord.notes).toBe('Updated notes for the patient.');
  });

  it('should delete a medical record', async () => {
    const res = await request(app)
      .delete(`/api/medical-records/${recordId}`)
      .set('Authorization', `Bearer ${doctorToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Medical record deleted successfully');
  });
});
