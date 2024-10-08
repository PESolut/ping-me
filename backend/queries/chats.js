const db = require("../db/dbConfig.js");

const getAllChats = async () => {
  try {
    const allChats = await db.any("SELECT * FROM chats ORDER BY created_at DESC");
    return allChats;
  } catch (error) {
    return error;
  }
};

const getChatByID = async (chatID) => {
  try {
    const oneChat = await db.one("SELECT * FROM chats WHERE id=$1", chatID);
    const chatUsers = await db.any(
      "SELECT users.id, users.username FROM user_chat JOIN users ON users.id = user_chat.user_id WHERE chat_id=$1",
      chatID
    );
    oneChat.users = chatUsers;
    return oneChat;
  } catch (error) {
    return error;
  }
};

const getChatsByUser = async (userID) => {
  try {
    const userChats = await db.any(
      "SELECT chats.* FROM user_chat JOIN chats ON chats.id = user_chat.chat_id WHERE user_id=$1 ORDER BY chats.created_at DESC",
      userID
    );
    return userChats;
  } catch (error) {
    return error;
  }
};

const createChat = async ({ name, created_by }) => {
  try {
    const newChat = await db.one(
      "INSERT INTO chats (name, created_by) VALUES ($1, $2) RETURNING *",
      [name, created_by]
    );
    // Add the creator to the chat
    await db.none(
      "INSERT INTO user_chat (user_id, chat_id) VALUES ($1, $2)",
      [created_by, newChat.id]
    );
    return newChat;
  } catch (error) {
    return error;
  }
};

const updateChat = async ({ name }, chatID) => {
  try {
    const updatedChat = await db.one(
      "UPDATE chats SET name=$1 WHERE id=$2 RETURNING *",
      [name, chatID]
    );
    return updatedChat;
  } catch (error) {
    return error;
  }
};

const deleteChat = async (chatID) => {
  try {
    const deletedChat = await db.one(
      "DELETE FROM chats WHERE id=$1 RETURNING *",
      chatID
    );
    return deletedChat;
  } catch (error) {
    return error;
  }
};

const addUserToChat = async (userID, chatID) => {
  try {
    const result = await db.one(
      "INSERT INTO user_chat (user_id, chat_id) VALUES ($1, $2) RETURNING *",
      [userID, chatID]
    );
    return result;
  } catch (error) {
    return error;
  }
};

const removeUserFromChat = async (userID, chatID) => {
  try {
    const result = await db.one(
      "DELETE FROM user_chat WHERE user_id=$1 AND chat_id=$2 RETURNING *",
      [userID, chatID]
    );
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllChats,
  getChatByID,
  getChatsByUser,
  createChat,
  updateChat,
  deleteChat,
  addUserToChat,
  removeUserFromChat,
};
