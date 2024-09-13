const async_manager = require("express-async-handler");
const Blog = require("../models/blog_model");
const upload = require("../middleware/file_upload");
/*
 * Description: GET all blog posts
 * HTTP Method & Endpoint: GET /api/blogs
 * Access: Private
 */
const get_posts = async_manager(async (req, res) => {
    const blogs = await Blog.find({ userID: req.user.id });
    res.status(200).json(blogs);
});

/*
 * Description: GET a specific blog post
 * HTTP Method & Endpoint: GET /api/blogs/:id
 * Access: Private
 */
const get_post = async_manager(async (req, res) => {
    const blog_post = await Blog.find({ userID: req.user.id });
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }
    res.status(200).json(blog_post);
});

/*
 * Description: Create a blog post
 * HTTP Method & Endpoint: POST /api/blogs
 * Access: Private
 */
const create_post = async_manager(async (req, res) => {
    console.log("the request body: ", req.body);
    const { title, content, author, tags } = req.body;

    // Check for missing fields
    if (!title || !content || !author || !tags) {
        return res.status(400).json({ error: "Must enter all fields!" });
    }

    // Check if a blog post with the same title already exists for the current user
    const existingPost = await Blog.findOne({ title, userID: req.user.id });
    if (existingPost) {
        return res.status(400).json({ error: "You have already created a blog post with this title!" });
    }

    // Handle the header image if provided
    const headerImage = req.file ? req.file.path : null;

    // Create a new blog post
    const blog_post = await Blog.create({
        title,
        content,
        author,
        tags,
        userID: req.user.id,
        headerImage
    });

    res.status(201).json(blog_post);
});


/*
 * Description: Update a blog post
 * HTTP Method & Endpoint: PUT /api/blogs/:id
 * Access: Private
 */
const update_post = async_manager(async (req, res) => {
    const blog_post = await Blog.findById(req.params.id);
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }
    if (blog_post.userID.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User unallowed to update other users' blog posts");
    }

    const headerImage = req.file ? req.file.path : blog_post.headerImage;

    const updated_post = await Blog.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body,
            headerImage
        },
        { new: true, runValidators: true }
    );
    res.status(200).json(updated_post);
});

/*
 * Description: Delete a blog post
 * HTTP Method & Endpoint: DELETE /api/blogs/:id
 * Access: Private
 */
const delete_post = async_manager(async (req, res) => {
    const blog_post = await Blog.findById(req.params.id);
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }
    if (blog_post.userID.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User unallowed to delete other users' blog posts");
    }
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog post deleted", blog_post });
});

//public routes

/*
 * Description: Search blog posts by title and/or tags
 * HTTP Method & Endpoint: GET /api/blogs/search
 * Access: Public
 */
const search_posts = async_manager(async (req, res) => {
    const { title, tags } = req.query;

    const query = {};
    if (title) {
        query.title = { $regex: title, $options: "i" };
    }
    if (tags) {
        const tagsArray = tags.split(',').map(tag => tag.trim());
        query.tags = { $in: tagsArray };
    }

    // Find matching blog posts
    const blogs = await Blog.find(query);

    if (blogs.length === 0) {
        res.status(404).json({ message: "No match found" });
    } else {
        res.status(200).json(blogs);
    }
});

//like,comment,save(private)

/*
 * Description: Like a blog post
 * HTTP Method & Endpoint: PUT /api/blogs/:id/like
 * Access: Private
 */
const like_post = async_manager(async (req, res) => {

    // Find the blog post by its ID
    const blog_post = await Blog.findById(req.params.id);
    
    // If the blog post is not found, return a 404 error
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }

    // Ensure that the likes field is an array (should have been initialized as such)
    if (!Array.isArray(blog_post.likes)) {
        blog_post.likes = [];
    }

    // Check if the user has already liked this post (prevents multiple likes from the same user)
    if (blog_post.likes.includes(req.user.id)) {
        res.status(400);
        throw new Error("You have already liked this post.");
    }

    // Add the user's ID to the likes array if they haven't liked it yet
    blog_post.likes.push(req.user.id);

    // Save the updated blog post
    await blog_post.save();

    // Return the updated blog post, showing the new likes count and list of users who liked it
    res.status(200).json(blog_post);
});


/*
 * Description: Comment on a blog post
 * HTTP Method & Endpoint: POST /api/blogs/:id/comment
 * Access: Private
 */
const comment_on_post = async_manager(async (req, res) => {
    const blog_post = await Blog.findById(req.params.id);
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }

    const { text } = req.body;
    if (!text) {
        res.status(400);
        throw new Error("Comment text is required");
    }

    // Add comment
    blog_post.comments.push({
        user: req.user.id,
        text,
    });
    await blog_post.save();

    res.status(201).json(blog_post);
});

/*
 * Description: Save a blog post
 * HTTP Method & Endpoint: PUT /api/blogs/:id/save
 * Access: Private
 */
const save_post = async_manager(async (req, res) => {
    const blog_post = await Blog.findById(req.params.id);
    if (!blog_post) {
        res.status(404);
        throw new Error("Blog post not found!");
    }

    // Add user to savedBy array if not already saved
    if (!blog_post.savedBy.includes(req.user.id)) {
        blog_post.savedBy.push(req.user.id);
        await blog_post.save();
    }

    res.status(200).json(blog_post);
});



module.exports = { get_posts, get_post, create_post, update_post, delete_post, search_posts, like_post, comment_on_post, save_post };