const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
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
        likes: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                user: {
                    type: String,
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blog', blogSchema);