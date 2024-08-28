const express = require("express");
const { signupUser, loginUser, getCurrentUser } = require("../controllers/user_controllers");
const api = express.Router();

api.post("/signup", signupUser);

api.post("/login", loginUser);

api.get("/current", getCurrentUser);

module.exports = api;