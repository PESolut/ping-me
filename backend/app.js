// DEPENDENCIES
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userController = require("./controllers/userController.js");
const chatController = require("./controllers/chatController.js");
const userChatController = require("./controllers/userChatController.js");
const messageController = require("./controllers/messageController.js");

// CONFIGURE
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// CONTROLLERS
app.use("/users", userController);
app.use("/chats", chatController);
app.use("/user-chats", userChatController);
app.use("/messages", messageController);

// ROUTES
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Ping-Me Server");
});

app.get("/not-found", (req, res) => {
  res.status(404).json({
    error: "Page Not Found",
  });
});

app.get("*", (req, res) => {
  res.redirect("/not-found");
});

// EXPORT
module.exports = app;
