const express = require('express');

const router = express.Router();

const requireAuth = require("../middleware/authmiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    getAllPosts,
    getMyPosts,
    createPost,
    deletePost,
    getEditPost,
    editPost,
    getPostById,
    toggleLike,
} = require("../controllers/postController");


// =========================
// ALL POSTS
// =========================

router.get(
    '/',
    requireAuth,
    getAllPosts
);


// =========================
// MY POSTS
// IMPORTANT: Keep this BEFORE /:id/edit
// =========================

router.get(
    '/my',
    requireAuth,
    getMyPosts
);


// =========================
// CREATE POST
// =========================

router.get(
    '/create',
    requireAuth,
    (req, res) => {
        res.render('posts/create');
    }
);


router.post(
    "/create",
    requireAuth,
    upload.single("image"),
    createPost
);


router.get(
    "/:id",
    getPostById
);


router.post(
    "/:id/like",
    requireAuth,
    toggleLike
);

// =========================
// EDIT POST
// =========================


router.get(
    "/:id/edit",
    requireAuth,
    getEditPost
);


router.post(
    "/:id/edit",
    requireAuth,
    upload.single("image"),
    editPost
);


// =========================
// DELETE POST
// =========================

router.post(
    "/:id/delete",
    requireAuth,
    deletePost
);


module.exports = router;