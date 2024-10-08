const express = require("express");
const users = express.Router();
const jwt = require('jsonwebtoken');
const {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../queries/users.js");
const auth = require('../middleware/auth');

// Register a new user (public route)
users.post("/register", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    const token = jwt.sign({ user: { id: newUser.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user (public route)
users.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    
    // If login is successful, create a token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ user, token });
  } catch (error) {
    // Here we're being intentionally vague about the error to not give away too much information
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Get all users (protected route)
users.get("/", auth, async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID (protected route)
users.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByID(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (protected route)
users.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const updatedUser = await updateUser(id, { username, email, password });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (protected route)
users.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = users;
