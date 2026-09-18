const multer = require('multer'); // Import the multer library, which is used for handling file uploads in Node.js applications
const path = require("path");


const storage = multer.diskStorage({ // Configure the storage settings for multer, specifying how and where uploaded files should be stored on the server
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname, "..", "assets"));
    },
    filename : (req,file,cb) => {
        cb(null,Date.now() + "-" + file.originalname); // Generate a unique filename for the uploaded file by prepending the current timestamp to the original filename, preventing filename collisions
    }
});

const upload = multer({
    storage: storage // Configure multer to use the defined storage settings, enabling it to handle file uploads according to the specified destination and filename rules
});

module.exports = upload; // Export the configured multer instance so that it can be used in other parts of the application to handle file uploads