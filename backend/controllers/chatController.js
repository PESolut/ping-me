const express = require("express");
const chats = express.Router();
const {
  getAllChats,
  getChatByID,
  getChatsByUser,
  createChat,
  updateChat,
  deleteChat,
  addUserToChat,
  removeUserFromChat,
} = require("../queries/chats.js");
const auth = require('../middleware/auth');

// INDEX - Get all chats (protected)
chats.get("/", auth, async (req, res) => {
  const allChats = await getAllChats();
  if (allChats.length) {
    res.status(200).json(allChats);
  } else {
    res.status(500).json({ Error: "Server Error" });
  }
});

// SHOW - Get a specific chat (protected)
chats.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const oneChat = await getChatByID(id);

  if (!oneChat.message) {
    res.status(200).json(oneChat);
  } else {
    res.status(404).json({ Error: "Chat not found" });
  }
});

// Get chats for a specific user (protected)
chats.get("/user/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const userChats = await getChatsByUser(userId);

  if (userChats.length) {
    res.status(200).json(userChats);
  } else {
    res.status(404).json({ Error: "No chats found for this user" });
  }
});

// CREATE - Create a new chat (protected)
chats.post("/", auth, async (req, res) => {
  const newChat = await createChat(req.body);

  if (!newChat.message) {
    res.status(201).json(newChat);
  } else {
    res.status(500).json({ Error: newChat.message });
  }
});

// UPDATE - Update a chat (protected)
chats.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const updatedChat = await updateChat(req.body, id);

  if (!updatedChat.message) {
    res.status(200).json(updatedChat);
  } else {
    res.status(500).json({ Error: updatedChat.message });
  }
});

// DELETE - Delete a chat (protected)
chats.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deletedChat = await deleteChat(id);

  if (!deletedChat.message) {
    res.status(200).json(deletedChat);
  } else {
    res.status(500).json({ Error: deletedChat.message });
  }
});

// Add a user to a chat (protected)
chats.post("/:id/users", auth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const result = await addUserToChat(userId, id);

  if (!result.message) {
    res.status(201).json(result);
  } else {
    res.status(500).json({ Error: result.message });
  }
});

// Remove a user from a chat (protected)
chats.delete("/:id/users/:userId", auth, async (req, res) => {
  const { id, userId } = req.params;
  const result = await removeUserFromChat(userId, id);

  if (!result.message) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ Error: result.message });
  }
});

module.exports = chats;
