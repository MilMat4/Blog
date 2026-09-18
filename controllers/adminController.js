const User = require("../models/User"); // Import the User model from the models directory to interact with the User collection in the MongoDB database

const getAllUsers = async (req, res) => {  // Define an asynchronous function to handle the request for retrieving all users from the database
    try {
        const users = await User.find();

        res.render("admin/users", {
            users: users
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllUsers
};