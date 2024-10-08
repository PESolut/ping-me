const db = require("../db/dbConfig.js");

const getUserChats = async (userID) => {
  try {
    const userChats = await db.any(
      `SELECT chats.*, user_chat.joined_at 
       FROM user_chat 
       JOIN chats ON chats.id = user_chat.chat_id 
       WHERE user_chat.user_id = $1 
       ORDER BY chats.created_at DESC`,
      userID
    );
    return userChats;
  } catch (error) {
    return error;
  }
};

const getChatUsers = async (chatID) => {
  try {
    const chatUsers = await db.any(
      `SELECT users.id, users.username, user_chat.joined_at 
       FROM user_chat 
       JOIN users ON users.id = user_chat.user_id 
       WHERE user_chat.chat_id = $1 
       ORDER BY user_chat.joined_at ASC`,
      chatID
    );
    return chatUsers;
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
      "DELETE FROM user_chat WHERE user_id = $1 AND chat_id = $2 RETURNING *",
      [userID, chatID]
    );
    return result;
  } catch (error) {
    return error;
  }
};

const isUserInChat = async (userID, chatID) => {
  try {
    const result = await db.oneOrNone(
      "SELECT * FROM user_chat WHERE user_id = $1 AND chat_id = $2",
      [userID, chatID]
    );
    return result !== null;
  } catch (error) {
    return error;
  }
};

const getCommonChats = async (userID1, userID2) => {
  try {
    const commonChats = await db.any(
      `SELECT chats.* 
       FROM user_chat uc1
       JOIN user_chat uc2 ON uc1.chat_id = uc2.chat_id
       JOIN chats ON chats.id = uc1.chat_id
       WHERE uc1.user_id = $1 AND uc2.user_id = $2`,
      [userID1, userID2]
    );
    return commonChats;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getUserChats,
  getChatUsers,
  addUserToChat,
  removeUserFromChat,
  isUserInChat,
  getCommonChats,
};
