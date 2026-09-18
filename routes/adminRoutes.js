const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/authmiddleware");

const requireRole = require("../middleware/roleMiddleware");

const {
    getAllUsers
} = require("../controllers/adminController");


router.get(
    "/users",
    requireAuth,
    requireRole("superadmin"),
    getAllUsers
);


module.exports = router;