const request = require('supertest');
const app = require('../../app');
const db = require('../../db/dbConfig');

describe('Authentication', () => {
  afterEach(async () => {
    await db.query('DELETE FROM users');
  });

  test('User can register', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  test('User can login', async () => {
    // First, register a user
    await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword'
      });

    // Then, try to login
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  test('Login fails with incorrect credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
