const db = require("../db/dbConfig.js");
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
  try {
    const allUsers = await db.any("SELECT * FROM users ORDER BY created_at DESC");
    return allUsers;
  } catch (error) {
    return error;
  }
};

const getUserByID = async (id) => {
  try {
    const oneUser = await db.one("SELECT * FROM users WHERE id=$1", id);
    return oneUser;
  } catch (error) {
    return error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const oneUser = await db.one("SELECT * FROM users WHERE username=$1", username);
    return oneUser;
  } catch (error) {
    return error;
  }
};

const createUser = async ({ username, email, password }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.one(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, { username, email, password }) => {
  try {
    let query, values;
    if (password) {
      // If password is provided, hash it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query = "UPDATE users SET username=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, username, email";
      values = [username, email, hashedPassword, id];
    } else {
      // If no password is provided, update only username and email
      query = "UPDATE users SET username=$1, email=$2 WHERE id=$3 RETURNING id, username, email";
      values = [username, email, id];
    }

    const updatedUser = await db.one(query, values);
    return updatedUser;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await db.one("DELETE FROM users WHERE id=$1 RETURNING *", id);
    return deletedUser;
  } catch (error) {
    return error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    // Find the user by email
    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", email);

    // If no user found, throw an error
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // If passwords match, return user data (excluding the password)
    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
