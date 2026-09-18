const requireAuth = (req, res, next) => {
    if(!req.session.userId) { // Check if the user is not authenticated by verifying if the userId is not present in the session
        return res.redirect('/login'); // If the user is not authenticated, redirect them to the login page
    }
    next(); // Call the next middleware function in the stack
};

module.exports = requireAuth; // Export the requireAuth middleware function so that it can be imported and used in other parts of the application, allowing it to protect routes that require authentication