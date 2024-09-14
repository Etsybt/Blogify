const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    bio: {
        type: String,
        default: "", // Optional bio field
    },
    profilePicture: {
        type: String,
        default: "", // Path to the profile picture file
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);