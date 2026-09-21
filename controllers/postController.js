const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs"); // Import the Node.js File System module to handle file operations, such as deleting images from the server
const path = require("path"); // Import the Node.js Path module to handle and transform file paths, ensuring compatibility across different operating systems


const getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find()
            .populate("author")
            .sort({ createdAt: -1 });

        const validPosts = posts.filter(post => post.author);


        let featuredPost = null;


        if (validPosts.length > 0) {

            featuredPost = validPosts.reduce(
                (mostLiked, post) => {

                    if (
                        !mostLiked ||
                        post.likes.length > mostLiked.likes.length
                    ) {
                        return post;
                    }

                    return mostLiked;

                },
                null
            );

        }


        const remainingPosts = validPosts.filter(
            post =>
                !featuredPost ||
                post._id.toString() !== featuredPost._id.toString()
        );


        res.render("posts/index", {

            posts: remainingPosts,

            featuredPost: featuredPost,

            isMyPosts: false

        });


    } catch (error) {

        console.log(error);

        res.status(500).send("Server Error");

    }
};


const getMyPosts = async (req, res) => {

    try {

        const posts = await Post.find({
            author: req.session.userId
        })
            .populate("author")
            .sort({ createdAt: -1 });

        const validPosts = posts.filter(post => post.author);


        let featuredPost = null;


        if (validPosts.length > 0) {

            featuredPost = validPosts.reduce(
                (mostLiked, post) => {

                    if (
                        !mostLiked ||
                        post.likes.length > mostLiked.likes.length
                    ) {
                        return post;
                    }

                    return mostLiked;

                },
                null
            );

        }


        const remainingPosts = validPosts.filter(
            post =>
                !featuredPost ||
                post._id.toString() !== featuredPost._id.toString()
        );


        res.render("posts/index", {

            posts: remainingPosts,

            featuredPost: featuredPost,

            isMyPosts: true

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

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author");

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.render("posts/show", {
            post: post
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const toggleLike = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const userId = req.session.userId.toString();

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {

            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );

        } else {

            post.likes.push(req.session.userId);

        }

        await post.save();

        res.redirect(req.get("Referrer") || "/posts");

    } catch (error) {

        console.log(error);

        res.status(500).send("Failed to update like");
    }
};

const getHomePosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("author")
            .sort({ createdAt: -1 })
            .limit(6);

        const validPosts = posts.filter(post => post.author);

        res.render("home", {
            posts: validPosts
        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllPosts,
    getMyPosts,
    createPost,
    deletePost,
    getEditPost,
    editPost,
    getPostById,
    toggleLike,
    getHomePosts
};