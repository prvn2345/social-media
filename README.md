# MERN Social Media Platform (VibeNet)

A full-stack social media application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). 

---

## 🎨 Design Theme & Aesthetics
VibeNet is styled with a premium, responsive **Cyber-Dark Space Theme** built entirely with custom CSS. It features:
- **Glassmorphic Elements**: Translucent backgrounds, blurred panels, and neon-borders for modern visual depth.
- **Micro-Animations**: Click transitions, interactive heart-pop animations for liking posts, and slide-in components.
- **Fluid Layouts**: Fully responsive grids tailored to look stunning on mobile, tablet, and desktop views.

---

## 🚀 Key Modules & Functions

### 1. User & Authentication Module
- **JWT Authentication**: Secure token verification via Bearer headers.
- **Password Hashing**: Done automatically in the MongoDB pre-save hook using `bcryptjs`.
- **User Profile**: Dynamically fetches active session credentials and loads initials-based profile avatars using the DiceBear initials API.

### 2. Post Module
- **Create Post**: Publish titles, descriptions, and optional image links.
- **Paginated Feed**: Query parameters fetch posts in batches, saving server resources.
- **Post Ownership**: Authors can update and delete their own posts. Deleting a post automatically cascading-deletes all associated comments.

### 3. Comment Engine
- **Add Comments**: Instantly comment on posts directly from the feed card.
- **Strict Authorization**:
  - ✅ Comment Owners can delete their comment.
  - ✅ Post Owners can delete any comment on their post.
  - ❌ Guest users are forbidden from comment deletion.

### 4. Like / Unlike Engine
- **Toggle State**: Single toggle API to like/unlike.
- **Like Count**: Returns the updated array counts.

---

## 📁 Repository Structure
```
social-media/
├── backend/                # Express, Node & MongoDB code
│   ├── config/             # DB Connection setups
│   ├── controllers/        # Express handlers (MVC)
│   ├── middleware/         # Auth, validation & error gates
│   ├── models/             # Mongoose Schemas (User, Post, Comment)
│   ├── routes/             # API Router maps
│   ├── utils/              # Helper utilities
│   ├── validators/         # Input express-validation rules
│   ├── .env                # Port, secret keys, db credentials
│   ├── README.md           # Backend-specific API documentation
│   └── social-media.postman_collection.json # Exported Postman collection
├── frontend/               # React client built with Vite
│   ├── src/
│   │   ├── components/     # UI components (PostCard, CreatePost, ProtectedRoute)
│   │   ├── context/        # Session AuthContext
│   │   ├── pages/          # Feed, Login, Register, PostDetails pages
│   │   ├── services/       # Centralized API fetch definitions
│   │   ├── App.jsx         # App routes config
│   │   ├── index.css       # Core styling system (CSS variables, animations)
│   │   └── main.jsx        # App mounting file
│   └── vite.config.js      # Proxy settings redirecting to backend
├── package.json            # Root setup configuration
└── README.md               # Root setup documentation
```

---

## 📡 Backend API Reference

### Auth Endpoints (`/api/users`)
- `POST /register`: Registers new user. Payload: `{ username, email, password }`
- `POST /login`: Log in user. Payload: `{ email, password }`
- `GET /profile`: Get logged-in user details. *(Auth Header Required)*

### Post Endpoints (`/api/posts`)
- `POST /`: Creates a post. Payload: `{ title, content, imageUrl }` *(Auth Required)*
- `GET /`: Get all posts. Query parameters: `?page=1&limit=5`
- `GET /:id`: Get single post details by ObjectId.
- `PUT /:id`: Updates post details. Payload: `{ title, content, imageUrl }` *(Author only)*
- `DELETE /:id`: Deletes post and related comments. *(Author only)*

### Comment Endpoints (`/api/comments`)
- `POST /`: Write a comment. Payload: `{ postId, content }` *(Auth Required)*
- `GET /post/:postId`: Get comment thread for a specific post.
- `DELETE /:id`: Delete comment. *(Comment Owner or Post Owner only)*

### Like Endpoints (`/api/likes`)
- `POST /toggle/:postId`: Liking/unliking a post. *(Auth Required)*

---

## 💻 Running Locally

### 📋 Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/`) or a MongoDB Atlas connection.

### 🛠️ Installation & Setup
1. Clone or navigate to the workspace directory:
   ```bash
   cd social-media
   ```
2. Install dependencies for root, backend, and frontend with a single command:
   ```bash
   npm run install-all
   ```
3. Set up the environment variables:
   Create a `.env` file inside the `backend/` directory (a pre-configured `.env` with secure defaults is already created for you):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/social_media
   JWT_SECRET=supersecuresecretkeysocialmedia123
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

### 🏃 Start Running
To spin up both the Express backend and React frontend concurrently, run:
```bash
npm run dev
```
- **Backend API**: Running on [http://localhost:5000](http://localhost:5000)
- **Frontend App**: Running on [http://localhost:5173](http://localhost:5173) (Proxies `/api` automatically to Node.js)

---

## 🧪 Testing the APIs
You can import the Postman collection at `backend/social-media.postman_collection.json` inside Postman. It includes pre-written scripts that automatically set the Bearer Auth token for all protected requests upon logging in or registering.
