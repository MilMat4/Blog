# Blog Application

A full-stack blog application built with Node.js, Express.js, EJS, MongoDB, and Mongoose.

This project allows users to sign up, verify their email with OTP, create and manage blog posts, upload images, and access role-based admin functionality.

## Features

- User signup and login
- OTP email verification during signup
- Secure password hashing with bcrypt
- Session-based authentication
- Blog post creation, viewing, editing, and deletion
- Image upload support via Multer
- Role-based authorization with user and superadmin roles
- Super admin user management page

## Tech Stack

- Node.js
- Express.js
- EJS templates
- MongoDB Atlas or local MongoDB
- Mongoose
- Nodemailer
- Multer
- bcrypt

## Project Structure

```text
.
├── app.js
├── package.json
├── README.md
├── .gitignore
├── assets/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── postController.js
├── middleware/
│   ├── authmiddleware.js
│   ├── roleMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── Post.js
│   └── User.js
├── public/
│   └── css/
│       └── styles.css
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── postRoutes.js
├── utils/
│   └── mailer.js
├── views/
│   ├── admin/
│   ├── auth/
│   ├── partials/
│   └── posts/
└── .env
```

## Prerequisites

Before running the app, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB connection string ready
- A mail provider configured for OTP emails (Mailtrap is used in this project)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MilMat4/Blog.git
cd Blog
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

4. Start MongoDB locally if needed.

5. Run the application:

```bash
node app.js
```

The server will run on:

```text
http://localhost:5000
```

## Usage

### Sign up

- Open `/signup`
- Enter a username, email, and password
- An OTP is sent to the email address
- Enter the 6-digit code to complete signup

### Login

- Open `/login`
- Use the account you created

### Posts

- Authenticated users can create and manage posts
- Posts support image uploads
- Users can edit or delete only their own posts unless they are a superadmin

### Super Admin

The application supports a `superadmin` role.

Super admins can:

- Access the admin users view
- Edit any post
- Delete any post
- Manage the user list

The admin users page is available at:

```text
/admin/users
```

Example accounts for testing:

```text
Super Admin
Email: superadmin@example.com
Password: SuperAdmin123!
```

```text
Normal User
Email: user@example.com
Password: User123!
```

You can use these accounts to sign in and test both the admin and regular user flows immediately.

To assign a user as a superadmin manually in MongoDB, update the role field for that user document to `superadmin`.

## Notes

- Uploaded images are stored in the `assets` folder.
- The project currently uses local development settings and a local MongoDB instance by default.
- The `.env` file is ignored by Git and should never be committed.

## License

This project is licensed under the ISC License.
