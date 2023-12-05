const express = require("express");
const chatRoutes = express.Router();
const bodyParser = require("body-parser");
const { accessChats, fetchChats, createRoom, searchRooms, accessRoom } = require("../controllers/chat");

chatRoutes.use(bodyParser.urlencoded({ extended: false }));
chatRoutes.use(bodyParser.json());

chatRoutes.post("/accessChats",accessChats)
chatRoutes.get("/fetchChats",fetchChats)
chatRoutes.get("/searchRooms",searchRooms);
chatRoutes.post("/createRoom",createRoom);
chatRoutes.post("/accessRoom",accessRoom);

module.exports = { chatRoutes };