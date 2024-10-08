const express = require("express");
const messages = express.Router();
const {
  getAllMessages,
  getMessagesByChat,
  getMessageByID,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../queries/messages.js");
const auth = require('../middleware/auth');

// INDEX - Get all messages (protected)
messages.get("/", auth, async (req, res) => {
  const allMessages = await getAllMessages();
  if (allMessages.length) {
    res.status(200).json(allMessages);
  } else {
    res.status(500).json({ Error: "Server Error" });
  }
});

// Get messages for a specific chat (protected)
messages.get("/chat/:chatId", auth, async (req, res) => {
  const { chatId } = req.params;
  const chatMessages = await getMessagesByChat(chatId);

  if (chatMessages.length) {
    res.status(200).json(chatMessages);
  } else {
    res.status(404).json({ Error: "No messages found for this chat" });
  }
});

// SHOW - Get a specific message (protected)
messages.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const oneMessage = await getMessageByID(id);

  if (!oneMessage.message) {
    res.status(200).json(oneMessage);
  } else {
    res.status(404).json({ Error: "Message not found" });
  }
});

// CREATE - Create a new message (protected)
messages.post("/", auth, async (req, res) => {
  const newMessage = await createMessage(req.body);

  if (!newMessage.message) {
    res.status(201).json(newMessage);
  } else {
    res.status(500).json({ Error: newMessage.message });
  }
});

// UPDATE - Update a message (protected)
messages.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const updatedMessage = await updateMessage(req.body, id);

  if (!updatedMessage.message) {
    res.status(200).json(updatedMessage);
  } else {
    res.status(500).json({ Error: updatedMessage.message });
  }
});

// DELETE - Delete a message (protected)
messages.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const deletedMessage = await deleteMessage(id);

  if (!deletedMessage.message) {
    res.status(200).json(deletedMessage);
  } else {
    res.status(500).json({ Error: deletedMessage.message });
  }
});

module.exports = messages;
