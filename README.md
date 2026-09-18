# Blog Application

A full-stack blog application built using Node.js, Express.js, EJS, MongoDB and Mongoose.

The application provides user authentication, session management, role-based authorization, blog post CRUD operations, image uploads, and a Super Admin user management page.

---

## Features

### User Authentication

- User signup
- User login
- User logout
- Password hashing using bcrypt
- Session-based authentication
- Protected routes for authenticated users

### Blog Posts

- Create blog posts
- View all blog posts
- Edit blog posts
- Delete blog posts
- Upload images with blog posts
- Display uploaded images
- Author information displayed with each post

### Image Management

- Image uploads using Multer
- Images stored in the `assets` directory
- Uploaded images displayed in blog posts
- Images are deleted when their associated post is deleted
- Old images are deleted when a post is updated with a new image

### Role-Based Authorization

The application supports two roles:

- `user`
- `superadmin`

Normal users can:

- Create posts
- View posts
- Edit their own posts
- Delete their own posts

Super Admins can:

- Create posts
- View posts
- Edit any post
- Delete any post
- Access the Manage Users page

### Super Admin

The Super Admin role is currently assigned manually through MongoDB.

Super Admins can access:

```text
/admin/users
