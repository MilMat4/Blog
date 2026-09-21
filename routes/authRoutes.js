const express = require('express');

const router = express.Router();

const {
    signup,
    showVerifyOtp,
    verifyOtp,
    login,
    logout
} = require('../controllers/authController'); // Import the signup function from the authController module, allowing it to be used as a route handler for handling user signup requests

router.get("/signup", (req,res) => {
    res.render("auth/signup");
}); // Define a route for the "/signup" URL that responds to GET requests by rendering the "auth/signup" EJS template, allowing users to access the signup page

router.post("/signup", signup); // Define a route for the "/signup" URL that responds to POST requests by invoking the signup function, which handles the user signup process and creates a new user account
router.get("/verify-otp", showVerifyOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login); // Define a route for the "/login" URL that responds to POST requests by invoking the login function, which handles the user login process and authenticates the user

router.get("/login", (req,res) => {
    res.render("auth/login");
}); // Define a route for the "/login" URL that responds to GET requests by rendering the "auth/login" EJS template, allowing users to access the login page

router.get("/logout",logout); // Define a route for the "/logout" URL that responds to GET requests by invoking the logout function, which handles the user logout process and terminates the user's session


module.exports = router; 