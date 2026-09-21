const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({  // Define a new Mongoose schema for the Post model, specifying the structure of post documents in the MongoDB collection

    title: {

        type : String,

        required : true

    },

    content: {

        type : String,

        required : true

    },

    image: {

        type: String

    },

    author: {

        type : mongoose.Schema.Types.ObjectId, // Define the author field as an ObjectId, which references the User model, establishing a relationship between posts and users

        ref : 'User', // Specify that the author field references the User model, allowing population of user data when querying posts

        required : true

    },

    likes: [

        {

            type: mongoose.Schema.Types.ObjectId,

            ref: 'User'

        }

    ]

},{

    timestamps : true // Enable automatic creation of createdAt and updatedAt timestamps for each post document, allowing tracking of when posts are created and last updated

});

const Post = mongoose.model("Post",postSchema); // Create a Mongoose model named "Post" based on the defined postSchema, allowing interaction with the "posts" collection in the MongoDB database

module.exports = Post; // Export the Post model so that it can be imported and used in other parts of the application, enabling CRUD operations on post documents in the MongoDB database