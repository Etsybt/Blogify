const express = require("express");
const { signupUser, loginUser, getCurrentUser } = require("../controllers/user_controllers");
const token_validator = require("../middleware/token_manager");
const api = express.Router();

api.post("/signup", signupUser);

api.post("/login", loginUser);

api.get("/current", token_validator, getCurrentUser);

module.exports = api;