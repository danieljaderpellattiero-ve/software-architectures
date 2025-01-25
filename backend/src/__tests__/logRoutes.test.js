const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');

let adminToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
  });

  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  await Log.create({
    action: 'TEST_ACTION',
    user: admin._id,
    details: { message: 'Test log' },
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Log API', () => {
  it('should fetch all logs for admin', async () => {
    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('action');
  });
});
