const User = require("../models/User");

const requireRole = (...roles) => { // Define a middleware function that takes one or more roles as arguments, allowing it to check if the authenticated user has the required role(s) to access certain routes
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.session.userId);

            if (!user) {
                return res.redirect("/login");
            }

            if (!roles.includes(user.role)) {  // Check if the user's role is not included in the allowed roles passed to the middleware. If the user's role is not authorized, send a 403 Forbidden response with the message "Access denied"
                return res.status(403).send("Access denied");
            }

            next();

        } catch (error) {
            console.log(error);
            res.status(500).send("Server Error");
        }
    };
};

module.exports = requireRole;