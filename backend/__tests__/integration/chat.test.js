const request = require('supertest');
const app = require('../../app');
const db = require('../../db/dbConfig');

let testUser, testToken, testChat;

beforeAll(async () => {
  // Create a test user
  const userResponse = await request(app)
    .post('/users/register')
    .send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
  testUser = userResponse.body.user;
  testToken = userResponse.body.token;
});

afterAll(async () => {
  await db.query('DELETE FROM messages');
  await db.query('DELETE FROM user_chat');
  await db.query('DELETE FROM chats');
  await db.query('DELETE FROM users');
});

describe('Chat API', () => {
  test('Create a chat', async () => {
    const response = await request(app)
      .post('/chats')
      .set('x-auth-token', testToken)
      .send({ name: 'Test Chat' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Chat');

    testChat = response.body;
  });

  test('Get user chats', async () => {
    const response = await request(app)
      .get(`/chats/user/${testUser.id}`)
      .set('x-auth-token', testToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id).toBe(testChat.id);
  });

  test('Update chat name', async () => {
    const response = await request(app)
      .put(`/chats/${testChat.id}`)
      .set('x-auth-token', testToken)
      .send({ name: 'Updated Test Chat' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Test Chat');
  });

  test('Unauthorized user cannot access chat', async () => {
    // Create another user
    const anotherUserResponse = await request(app)
      .post('/users/register')
      .send({
        username: 'anotheruser',
        email: 'anotheruser@example.com',
        password: 'anotherpassword'
      });
    const anotherUserToken = anotherUserResponse.body.token;

    // Try to access the chat with the new user
    const response = await request(app)
      .get(`/chats/${testChat.id}`)
      .set('x-auth-token', anotherUserToken);

    expect(response.status).toBe(403);
  });
});
