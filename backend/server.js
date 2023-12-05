const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { authRoutes } = require("./routes/auth");
const { userRoutes } = require("./routes/user");
const { verifyToken } = require("./middleware/verifyToken");
const { chatRoutes } = require("./routes/chat");
const { messageRoutes } = require("./routes/message");
const routes = express.Router();
const { Server } = require("socket.io");

dotenv.config();
const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/chat", verifyToken, chatRoutes);
app.use("/api/message", verifyToken, messageRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(process.env.PORT);
    const io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGIN_URL,
      },
    });

    const onlineUsers = new Set();

    io.on("connection", (socket) => {
      const onSetup = (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      };
      const onJoinChat = (room) => {
        socket.join(room);
      };

      const onNewMessage = (newMessageRecieved) => {
        const { chat } = newMessageRecieved;
        if (!chat.users) {
          return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
          if (user._id === newMessageRecieved.sender._id) {
            return;
          }
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      };

      const onUserLogin = ({ userData, allChats }) => {
        onlineUsers.add(userData._id);
        for (let i = 0; i < allChats.length; i++) {
          const chat = allChats[i];
          chat.users?.forEach((user) => {
            if (userData._id !== user._id && onlineUsers.has(user._id)) {
              socket.in(user._id).emit("setUserOnline", userData._id);
              io.in(userData._id).emit("setUserOnline", user._id);
            }
          });
        }
      };

      const onUserLogout = ({ userData, allChats }) => {
        onlineUsers.delete(userData._id);
        for (let i = 0; i < allChats.length; i++) {
          const chat = allChats[i];
          chat.users?.forEach((user) => {
            if (onlineUsers.has(user._id)) {
              socket.in(user._id).emit("setUserOffline", userData._id);
            }
          });
        }
      };

      socket.on("setup", onSetup);

      socket.on("join chat", onJoinChat);

      socket.on("new message", onNewMessage);

      socket.on("login", onUserLogin);

      socket.on("logout", onUserLogout);
    });
  })
  .catch((error) => console.log(error));

module.exports = app;
