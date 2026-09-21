require('dotenv').config();

const express = require('express'); // Import the Express library

const session = require('express-session'); // Import express-session for session management

const path = require('path'); // Import path module

const connectDB = require('./config/db'); // Import database connection

const authRoutes = require('./routes/authRoutes'); // Import authentication routes

const postRoutes = require('./routes/postRoutes'); // Import post routes

const adminRoutes = require("./routes/adminRoutes"); // Import admin routes

const { getHomePosts } = require("./controllers/postController"); // Import home controller


const app = express(); // Create Express application


connectDB(); // Connect to MongoDB


app.set('view engine', 'ejs'); // Set EJS as the view engine


app.use(express.urlencoded({ extended: true })); // Parse form data


app.use(

    session({

        secret: 'mysecret',

        resave: false,

        saveUninitialized: false

    })

);


// Make session available to every EJS file

app.use((req, res, next) => {

    res.locals.session = req.session;

    next();

});


app.use(express.static("public")); // Serve files from public


app.use(
    "/assets",
    express.static(path.join(__dirname, "assets"))
); // Serve uploaded images


app.use('/', authRoutes); // Authentication routes

app.use('/posts', postRoutes); // Post routes

app.use("/admin", adminRoutes); // Admin routes


// Home page

app.get("/", getHomePosts);


app.listen(5000, () => {

    console.log('Server is running on port 5000');

});