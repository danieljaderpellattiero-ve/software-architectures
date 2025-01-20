const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Импортируем jsonwebtoken

let token;
let userId;
let email;

jest.setTimeout(10000); // Увеличение глобального таймаута для тестов

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  it('should create a new user', async () => {
    email = `test${Date.now()}@example.com`; // Генерация уникального email
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email,
        role: 'patient',
        password: 'testpassword',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('_id');
    userId = res.body.user._id;
  });

  it('should log in the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email,
        password: 'testpassword',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should update the user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated User');
  });

  it('should delete the user', async () => {
    // Авторизация с администраторским токеном
    const adminToken = jwt.sign(
      { id: 'admin_user_id', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});
