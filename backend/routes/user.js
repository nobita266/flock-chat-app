const express = require("express");
const userRoutes = express.Router();
const bodyParser = require("body-parser");
const { searchUsers } = require("../controllers/user");

userRoutes.use(bodyParser.urlencoded({ extended: false }));
userRoutes.use(bodyParser.json());

userRoutes.get("/searchUsers", searchUsers);

module.exports = { userRoutes };
