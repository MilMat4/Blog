const bcrypt = require('bcrypt');

const User = require('../models/User');


const signup = async (req, res) => { // Define an asynchronous function to handle the signup process for new users

    try {

        const { username, email, password } = req.body;


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({

            username,

            email,

            password: hashedPassword,

            role: 'user'

        });


        await user.save();


        res.redirect("/login");


    } catch (error) {

        console.log(error);

        res.status(500).send("Signup Failed");

    }

};



const login = async (req, res) => { // Define an asynchronous function to handle the login process for existing users

    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });


        if (!user) {

            return res.send("Invalid email or password");

        }


        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!passwordMatch) {

            return res.send("Invalid email or password");

        }


        // Store user information in session

        req.session.userId = user._id;

        req.session.role = user.role;


        res.redirect("/posts");


    } catch (error) {

        console.log(error);

        res.status(500).send("Login failed");

    }

};


const logout = (req, res) => { // Define a function to handle the logout process for users

    req.session.destroy(() => {

        res.redirect('/login');

    });

};


module.exports = {
    signup,
    login,
    logout
};