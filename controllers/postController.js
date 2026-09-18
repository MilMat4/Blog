const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs"); // Import the Node.js File System module to handle file operations, such as deleting images from the server
const path = require("path"); // Import the Node.js Path module to handle and transform file paths, ensuring compatibility across different operating systems


const getAllPosts = async (req, res) => { // Define an asynchronous function to handle the request for retrieving all posts from the database
    try {
        const posts = await Post.find().populate("author"); // Retrieve all posts from the database and populate the "author" field with the corresponding user data from the User collection

        res.render("posts/index", { // Render the "posts/index" view template and pass the retrieved posts data to it for display
            posts: posts
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


const createPost = async (req, res) => {  // Define an asynchronous function to handle the creation of a new post in the database
    try {
        const { title, content } = req.body;

        const post = new Post({
            title,
            content,
            author: req.session.userId,
            image: req.file ? req.file.filename : null // If an image file is uploaded, store its filename; otherwise, set the image field to null
        });

        await post.save();

        res.redirect("/posts");

    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to create post");
    }
};


const deletePost = async (req, res) => { // Define an asynchronous function to handle the deletion of a post from the database
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect("/login");
        }


        // Check permission
        if (
            user.role !== "superadmin" &&
            post.author.toString() !== user._id.toString()
        ) {
            return res.status(403).send("Access denied");
        }


        // Delete image from assets folder
        if (post.image) {

            const imagePath = path.join(
                __dirname,
                "..",
                "assets",
                post.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }


        // Delete post from MongoDB
        await Post.findByIdAndDelete(req.params.id);

        res.redirect("/posts");

    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to delete post");
    }
};


const getEditPost = async (req, res) => { // Define an asynchronous function to handle the request for retrieving a specific post for editing
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect("/login");
        }


        // User can only edit their own post
        if (
            user.role !== "superadmin" &&
            post.author.toString() !== user._id.toString()
        ) {
            return res.status(403).send("Access denied");
        }


        res.render("posts/edit", {
            post: post
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


const editPost = async (req, res) => { // Define an asynchronous function to handle the editing of a specific post in the database
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect("/login");
        }


        // User can only edit their own post
        if (
            user.role !== "superadmin" &&
            post.author.toString() !== user._id.toString()
        ) {
            return res.status(403).send("Access denied");
        }


        // If a new image is uploaded,
        // delete the old image
        if (req.file) {

            if (post.image) {

                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "assets",
                    post.image
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            post.image = req.file.filename;
        }


        post.title = req.body.title;
        post.content = req.body.content;

        await post.save();

        res.redirect("/posts");

    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to edit post");
    }
};


module.exports = {
    getAllPosts,
    createPost,
    deletePost,
    getEditPost,
    editPost
};