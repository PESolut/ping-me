const db = require("../db/dbConfig.js");

const getAllMessages = async () => {
  try {
    const allMessages = await db.any("SELECT * FROM messages ORDER BY created_at DESC");
    return allMessages;
  } catch (error) {
    return error;
  }
};

const getMessagesByChat = async (chatID) => {
  try {
    const chatMessages = await db.any(
      "SELECT messages.*, users.username FROM messages JOIN users ON users.id = messages.user_id WHERE chat_id=$1 ORDER BY created_at ASC",
      chatID
    );
    return chatMessages;
  } catch (error) {
    return error;
  }
};

const getMessageByID = async (messageID) => {
  try {
    const oneMessage = await db.one("SELECT * FROM messages WHERE id=$1", messageID);
    return oneMessage;
  } catch (error) {
    return error;
  }
};

const createMessage = async ({ user_id, chat_id, content }) => {
  try {
    const newMessage = await db.one(
      "INSERT INTO messages (user_id, chat_id, content) VALUES ($1, $2, $3) RETURNING *",
      [user_id, chat_id, content]
    );
    return newMessage;
  } catch (error) {
    return error;
  }
};

const updateMessage = async ({ content }, messageID) => {
  try {
    const updatedMessage = await db.one(
      "UPDATE messages SET content=$1 WHERE id=$2 RETURNING *",
      [content, messageID]
    );
    return updatedMessage;
  } catch (error) {
    return error;
  }
};

const deleteMessage = async (messageID) => {
  try {
    const deletedMessage = await db.one(
      "DELETE FROM messages WHERE id=$1 RETURNING *",
      messageID
    );
    return deletedMessage;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllMessages,
  getMessagesByChat,
  getMessageByID,
  createMessage,
  updateMessage,
  deleteMessage,
};
