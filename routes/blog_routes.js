const express = require("express");
const multer = require("multer");
const {
    get_posts,
    get_post,
    create_post,
    update_post,
    delete_post,
    search_posts,
    public_get_post,
    like_post,
    comment_on_post,
    save_post } = require("../controllers/blog_controllers");
const token_validator = require("../middleware/token_manager");
const api = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Public routes
api.get('/search', search_posts);
api.get('/:id', public_get_post);

api.use(token_validator);

api.route('/').get(get_posts).post(upload.single('headerImage'), create_post); 

api.route('/:id').get(get_post).put(upload.single('headerImage'), update_post).delete(delete_post);

// Like, comment, and save routes
api.route('/:id/like').put(like_post);
api.route('/:id/comment').post(comment_on_post);
api.route('/:id/save').put(save_post);

module.exports = api;