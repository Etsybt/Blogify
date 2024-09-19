const express = require("express");
const multer = require("multer");
const { 
    signupUser, 
    loginUser, 
    getCurrentUser, 
    updateUserProfile, 
    deleteUserAccount 
} = require("../controllers/user_controllers");

const token_validator = require("../middleware/token_manager");
const api = express.Router();

// Configure multer for file uploads (for profile picture)
const upload = multer({ dest: 'uploads/' });

api.post("/signup", signupUser);

api.post("/login", loginUser);

api.get("/current", token_validator, getCurrentUser);

// Update and Delete user profile using /api/users/:id
api.put("/:id", token_validator, upload.single('profilePicture'), updateUserProfile);
api.delete("/:id", token_validator, deleteUserAccount);

module.exports = api;