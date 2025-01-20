const request = require('supertest');
const app = require('../server'); // Убедитесь, что экспортируете `app` из `server.js`
const mongoose = require('mongoose');

// Подключение к тестовой базе данных
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Отключение после тестов
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  let token;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        role: 'patient',
        password: 'testpassword',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('_id');
  });

  it('should log in the user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should update the user', async () => {
    const res = await request(app)
      .put('/api/users/USER_ID') // Замените USER_ID на фактический ID
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Updated User');
  });

  it('should delete the user', async () => {
    const res = await request(app)
      .delete('/api/users/USER_ID') // Замените USER_ID на фактический ID
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});
