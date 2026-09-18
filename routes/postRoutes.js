const express = require('express');

const router = express.Router();

const requireAuth = require("../middleware/authmiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
    getAllPosts,
    createPost,
    deletePost,
    getEditPost,
    editPost
} = require("../controllers/postController");


router.get('/', requireAuth, getAllPosts);


router.get('/create', requireAuth, (req, res) => {

    res.render('posts/create');

});


router.post(
    "/create",
    requireAuth,
    upload.single("image"),
    createPost
);


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


router.post(
    "/:id/delete",
    requireAuth,
    deletePost
);


module.exports = router;