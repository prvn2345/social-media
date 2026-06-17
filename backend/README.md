# Social Media Platform Backend - API Documentation

A modern RESTful API for a Social Media Platform built using the MERN Stack (Node.js, Express.js, and MongoDB with Mongoose).

---

## 🛠️ Features Implemented
1. **User Authentication**: Register, login, JWT token generation, secure password hashing using `bcryptjs`.
2. **Post Management**: Create posts, view all posts (with paginated results), view single posts, update posts, and delete posts (with authorization locks).
3. **Comment Engine**: Add comments, view comments by post, and delete comments. Supports the cascading delete of comments when their parent post is deleted.
4. **Commenting Rules**:
   - ✅ Comment owner can delete their comment.
   - ✅ Post owner can delete any comment on their post.
   - ❌ Other users are blocked (403 Forbidden).
5. **Like Engine**: Single-toggle action likes/unlikes posts. Ensures users can only like a post once.
6. **Centralized Error Handling**: Unified error format `{ success: false, error: "message" }` with dynamic code mapping for Validation, Cast, and Duplicate Key errors.
7. **Request Validation**: Payload validators using `express-validator` to guarantee clean inputs.

---

## 🏗️ Folder Structure
```
backend/
├── config/             # Database connection configuration
├── controllers/        # Request controllers (User, Post, Comment, Like)
├── middleware/         # Auth verification, central errors, input validations
├── models/             # Mongoose Schemas (User, Post, Comment)
├── routes/             # Route configurations
├── utils/              # Helper functions (JWT signing, custom Error class)
├── validators/         # Input request validation rules
├── .env                # Local environment variables
├── package.json        # Node modules and build scripts
└── server.js           # Server application entry file
```

---

## 🗄️ Database Design (Mongoose)

### 1. User Model (`User.js`)
* `username`: String (required, unique, trimmed, min 3 chars).
* `email`: String (required, unique, lowercase, regex validated).
* `password`: String (required, hashed via `bcryptjs`).
* `avatar`: String (auto-generated placeholder using DiceBear initials API based on username).

### 2. Post Model (`Post.js`)
* `title`: String (required, trimmed, max 100 characters).
* `content`: String (required).
* `imageUrl`: String (optional, default empty string).
* `author`: ObjectId pointing to `'User'` (required).
* `likes`: Array of ObjectIds pointing to `'User'` (tracks unique user likes).
* `commentCount`: Number (cached counter incremented/decremented when comments are added/deleted).

### 3. Comment Model (`Comment.js`)
* `content`: String (required, trimmed, max 500 characters).
* `user`: ObjectId pointing to `'User'` (commenter, required).
* `post`: ObjectId pointing to `'Post'` (parent post, required).

---

## 📡 API Reference

### 🔐 Authentication (`/api/users`)
| Method | Endpoint | Access | Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | `username`, `email`, `password` | Create account and return JWT token |
| `POST` | `/login` | Public | `email`, `password` | Login credentials and return JWT token |
| `GET` | `/profile` | Private | *None (Requires Bearer Token)* | Return logged-in user profile details |

### 📝 Posts (`/api/posts`)
| Method | Endpoint | Access | Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | `title`, `content`, `imageUrl` (opt) | Create a new post |
| `GET` | `/` | Public | *None* (Query: `?page=1&limit=10`) | Get all posts paginated |
| `GET` | `/:id` | Public | *None* | Retrieve post details by ID |
| `PUT` | `/:id` | Private | `title`, `content`, `imageUrl` (opt) | Update post (Author only) |
| `DELETE`| `/:id` | Private | *None* | Delete post and comments (Author only) |

### 💬 Comments (`/api/comments`)
| Method | Endpoint | Access | Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | `postId`, `content` | Comment on a post (Increments post counter) |
| `GET` | `/post/:postId`| Public | *None* | Get all comments for a post |
| `DELETE`| `/:id` | Private | *None* | Delete comment (Comment or Post owner only) |

### ❤️ Likes (`/api/likes`)
| Method | Endpoint | Access | Body Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/toggle/:postId`| Private| *None* | Liking/Unliking post (toggles array item) |

---

## 🚀 Setup & Running instructions

### 📋 Prerequisites
- Node.js installed on your machine.
- MongoDB Server running locally (`mongodb://127.0.0.1:27017/`) or a MongoDB Atlas connection URI.

### 💻 Installation
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` variables (a sample `.env` is provided with defaults):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/social_media
   JWT_SECRET=supersecuresecretkeysocialmedia123
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

### 🏃 Running Server
- To run in production mode:
  ```bash
  npm start
  ```
- To run in development hot-reloading mode:
  ```bash
  npm run dev
  ```
The server will boot on `http://localhost:5000`. You can import `social-media.postman_collection.json` in Postman to begin testing routes immediately!
