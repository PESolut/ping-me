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

  // Create a test chat
  const chatResponse = await request(app)
    .post('/chats')
    .set('x-auth-token', testToken)
    .send({ name: 'Test Chat' });
  testChat = chatResponse.body;
});

afterAll(async () => {
  await db.query('DELETE FROM messages');
  await db.query('DELETE FROM user_chat');
  await db.query('DELETE FROM chats');
  await db.query('DELETE FROM users');
});

describe('Message API', () => {
  test('Create a message', async () => {
    const response = await request(app)
      .post('/messages')
      .set('x-auth-token', testToken)
      .send({
        chat_id: testChat.id,
        content: 'Hello, test chat!'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('Hello, test chat!');
    expect(response.body.user_id).toBe(testUser.id);
    expect(response.body.chat_id).toBe(testChat.id);
  });

  test('Get messages from a chat', async () => {
    const response = await request(app)
      .get(`/messages/chat/${testChat.id}`)
      .set('x-auth-token', testToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].content).toBe('Hello, test chat!');
  });

  test('Update a message', async () => {
    const createResponse = await request(app)
      .post('/messages')
      .set('x-auth-token', testToken)
      .send({
        chat_id: testChat.id,
        content: 'Original message'
      });

    const updateResponse = await request(app)
      .put(`/messages/${createResponse.body.id}`)
      .set('x-auth-token', testToken)
      .send({
        content: 'Updated message'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.content).toBe('Updated message');
  });

  test('Delete a message', async () => {
    const createResponse = await request(app)
      .post('/messages')
      .set('x-auth-token', testToken)
      .send({
        chat_id: testChat.id,
        content: 'Message to be deleted'
      });

    const deleteResponse = await request(app)
      .delete(`/messages/${createResponse.body.id}`)
      .set('x-auth-token', testToken);

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/messages/${createResponse.body.id}`)
      .set('x-auth-token', testToken);

    expect(getResponse.status).toBe(404);
  });
});
