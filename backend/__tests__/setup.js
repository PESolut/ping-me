const db = require('../db/dbConfig');

beforeAll(async () => {
  // Set up the test database
  await db.query('DROP TABLE IF EXISTS messages, user_chat, chats, users CASCADE');
  await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE chats (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE user_chat (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, chat_id)
    );

    CREATE TABLE messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterAll(async () => {
  // Clean up the test database
  await db.query('DROP TABLE IF EXISTS messages, user_chat, chats, users CASCADE');
  await db.pool.end();
});

beforeEach(async () => {
  // Clear all tables before each test
  // Be very careful with this in a production or shared database!
  try {
    await db.query('DELETE FROM messages');
    await db.query('DELETE FROM user_chat');
    await db.query('DELETE FROM chats');
    await db.query('DELETE FROM users');
    console.log('Database cleared for new test');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
});
