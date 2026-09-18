const mongoose = require('mongoose'); // Import the Mongoose library for MongoDB interaction

const connectDB = async () => {  // Define an asynchronous function to connect to the MongoDB database
    try{ // Start a try block to attempt the database connection
        await mongoose.connect("mongodb://localhost:27017/Blogapp");  // Attempt to connect to the MongoDB database at the specified URL (mongodb://localhost:27017/Blogapp)
        console.log("MongoDB Connected");
    } catch(error){ // Catch any errors that occur during the connection attempt
        console.log("DB Connection Failed");
        console.log(error); // Log the error details to the console for debugging purposes
    }
};

module.exports = connectDB; // Export the connectDB function so that it can be imported and used in other parts of the application, allowing the application to establish a database connection when needed