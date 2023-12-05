const express = require("express");
const messageRoutes = express.Router();
const bodyParser = require("body-parser");
const { sendMessage, fetchAllMessages, fetchPreSignedGetUrl } = require("../controllers/message");

messageRoutes.use(bodyParser.urlencoded({ extended: false }));
messageRoutes.use(bodyParser.json());

messageRoutes.post("/sendMessage", sendMessage);
messageRoutes.get("/fetchAllMessages/:chatId", fetchAllMessages);
messageRoutes.get("/fetchPreSignedGetUrl/:fileName", fetchPreSignedGetUrl);

module.exports = { messageRoutes };
