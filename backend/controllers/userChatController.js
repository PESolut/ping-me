const express = require("express");
const userChats = express.Router();
const {
  getUserChats,
  getChatUsers,
  addUserToChat,
  removeUserFromChat,
} = require("../queries/userChats.js");
const auth = require('../middleware/auth');

// Get all chats for a specific user (protected)
userChats.get("/user/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const chats = await getUserChats(userId);

  if (chats.length) {
    res.status(200).json(chats);
  } else {
    res.status(404).json({ Error: "No chats found for this user" });
  }
});

// Get all users in a specific chat (protected)
userChats.get("/chat/:chatId", auth, async (req, res) => {
  const { chatId } = req.params;
  const users = await getChatUsers(chatId);

  if (users.length) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ Error: "No users found for this chat" });
  }
});

// Add a user to a chat (protected)
userChats.post("/", auth, async (req, res) => {
  const { userId, chatId } = req.body;
  const result = await addUserToChat(userId, chatId);

  if (!result.message) {
    res.status(201).json(result);
  } else {
    res.status(500).json({ Error: result.message });
  }
});

// Remove a user from a chat (protected)
userChats.delete("/:userId/:chatId", auth, async (req, res) => {
  const { userId, chatId } = req.params;
  const result = await removeUserFromChat(userId, chatId);

  if (!result.message) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ Error: result.message });
  }
});

module.exports = userChats;
