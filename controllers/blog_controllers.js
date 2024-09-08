const async_manager = require("express-async-handler");
const Blog = require("../models/blog_model");
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
    const blog_post = await Blog.findById(req.params.id);
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
    if (!title || !content || !author || !tags) {
        res.status(400);
        throw new Error("Must enter all fields!");
    }
    const blog_post = await Blog.create({
        title,
        content,
        author,
        tags,
        userID: req.user.id
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
    const updated_post = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
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
        throw new Error("User unallowed to update other users' blog posts");
    }
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog post deleted", blog_post });
});

module.exports = { get_posts, get_post, create_post, update_post, delete_post };