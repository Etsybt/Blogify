const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: [true, "Please add a title"],
        },
        content: {
            type: String,
            required: [true, "Please add content"],
        },
        author: {
            type: String,
            required: [true, "Please add an author"],
        },
        tags: {
            type: [String],
            required: false,
        },
        headerImage: {
            type: String, // Store the file path or URL
            required: false,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        savedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blog', blogSchema);