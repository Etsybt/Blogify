const express = require("express");
const {
    get_posts,
    get_post,
    create_post,
    update_post,
    delete_post } = require("../controllers/blog_controllers");
const api = express.Router();

api.route('/').get(get_posts).post(create_post);

api.route('/:id').get(get_post).put(update_post).delete(delete_post);

module.exports = api;