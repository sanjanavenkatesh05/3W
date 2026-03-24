# 3W - Social Media Platform

A modern, mobile-first social media application offering real-time engagement, post creation, and secure user authentication. Built with scalability and beautiful UI design in mind.

## 📸 Screenshots

| The Global Feed | Viewing Comments |
| :---: | :---: |
| <img src="docs/feed.webp" alt="Feed View" width="300" /> | <img src="docs/comments.webp" alt="Comments View" width="300" /> |

<p align="center">
  <img src="docs/layout.webp" alt="App Layout" width="300" />
</p>

---

## 🚀 Live Deployment

- **Frontend:** [Insert Vercel Frontend Link Here]
- **Backend:** [https://threew-ioir.onrender.com](https://threew-ioir.onrender.com)

---

## 🛠️ Tech Stack

**Frontend Framework:** 
- React.js (Bootstrapped with Vite)
- UI Library: Material UI (MUI)

**Backend Framework:**
- Node.js & Express.js

**Database:**
- MongoDB Atlas (Cloud Database) using Mongoose ORM

**Authentication & Security:**
- JWT (JSON Web Tokens) for session management
- bcryptjs for secure password hashing

---

## ✨ Features

### Current Features
- **User Authentication:** Secure Sign Up and Log In system. Automatically generates unique `@usernames` for new users.
- **Protected Routing:** Feed, posting, and engagement features are locked behind authentication.
- **TopBar Actions:** Clickable user avatar with a dropdown menu to view the user profile name and log out securely.
- **Create Posts:** Users can write text and attach up to 4 images to a post.
- **Hashtag Parsing:** The UI automatically detects `#hashtags` in post content and renders them as clickable, bolded blue text.
- **Image Grids:** A dynamic masonry-style image grid perfectly formats 1, 2, 3, or 4 attached images per post.
- **Single-Use Liking System:** A robust Like button that ensures a single user can only like a post once. Users can toggle their like (un-like) if they change their mind.
- **Inline Comments:** Users can view the list of comments natively under each post and submit their own real-time responses.
- **Dark Mode:** A sleek, fully integrated Dark Mode that seamlessly switches the Material UI theme palettes.

### Planned / Remaining Features
- **User Profiles:** Dedicated pages to view a single user's post history, followers, and bio.
- **Post Sharing:** Implement actual URL-copying or native Web Share API for the Share button.
- **Image Upload Hosting:** Integrate AWS S3, Cloudinary, or Firebase Storage for hosting images instead of base64 data encoding to support larger files.
- **Follow System:** Activate the "Follow" buttons to populate a customized chronological feed for users based on who they follow.

---

## 🗄️ Database Schemas

The application relies on two primary Mongoose schemas stored in MongoDB.

### 1. User Schema
Stores sensitive authentication details and generated profile parameters.
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Automatically hidden from standard database queries
  },
  join_date: {
    type: Date,
    default: Date.now
  }
});
```

### 2. Post Schema
Stores the complex relational data required for the feed, including embedded comments and relation arrays like `liked_by`.
```javascript
const postSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(arr) { return arr.length <= 4; },
      message: 'A post can have at most 4 images'
    },
    default: []
  },
  // Tracks exactly which users have liked the post to enforce single-use
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  like_count: {
    type: Number,
    default: 0
  },
  comments: [{
    username: String,
    text: String,
    created_at: { type: Date, default: Date.now }
  }],
  share_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
```
