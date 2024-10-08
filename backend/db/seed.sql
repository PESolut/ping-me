-- Clear existing data
TRUNCATE users, chats, user_chat, messages RESTART IDENTITY CASCADE;

-- Seed data for users
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', 'hashed_password_1'),
('jane_smith', 'jane@example.com', 'hashed_password_2'),
('bob_johnson', 'bob@example.com', 'hashed_password_3');

-- Seed data for chats
INSERT INTO chats (name) VALUES
('General Chat'),
('Tech Talk'),
('Coffee Lovers');

-- Seed data for user_chat
INSERT INTO user_chat (user_id, chat_id) VALUES
(1, 1), (2, 1), (3, 1), -- All users in General Chat
(1, 2), (2, 2),         -- John and Jane in Tech Talk
(2, 3), (3, 3);         -- Jane and Bob in Coffee Lovers

-- Seed data for messages
INSERT INTO messages (user_id, chat_id, content) VALUES
(1, 1, 'Hello everyone!'),
(2, 1, 'Hi John, welcome to the chat!'),
(3, 1, 'Hey folks, how''s it going?'),
(1, 2, 'Anyone here interested in AI?'),
(2, 2, 'Yes, I''m working on a machine learning project right now.'),
(2, 3, 'I love a good cappuccino in the morning.'),
(3, 3, 'I prefer espresso, straight and strong!');
