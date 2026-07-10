# 🐝 Hive — Backend

A **RESTful social networking API** built with **Node.js**, **Express.js**, and **MongoDB** that enables users to create and manage communities with **role-based access control**, **content moderation**, **comments**, **reactions**, and **real-time-ready notifications**.

The platform is designed with scalability, security, and clean architecture in mind, making it suitable for both learning purposes and production-ready applications.

---

# ✨ Features

### 👤 Authentication & User Management
- Secure JWT authentication
- Password hashing using bcrypt
- Login using **email or username**
- Forgot/Reset password via email
- Profile & cover image uploads
- Update profile information
- Change password
- Delete account

---

### 👥 Community Management
- Create unlimited groups
- Search and browse groups
- Upload group logo & cover image
- Update group information
- Delete groups
- Automatic Owner assignment to creator

---

### 🔐 Role-Based Permissions

Each group has three permission levels:

| Role | Permissions |
|------|-------------|
| 👑 Owner | Full control over the group, members, posts, and settings |
| 🛡️ Admin | Moderate content and manage members |
| 👤 Member | Create posts, comment, react, and participate |

---

### 📝 Post Moderation System

Every newly created post enters a moderation workflow.

```
Create Post
      │
      ▼
 Pending Review
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Approved Rejected
```

Features include:

- Image uploads (up to **5 images**)
- Edit while pending
- Approval workflow
- Rejection workflow
- Author deletion
- Moderator deletion

---

### 💬 Comments

- Comment on approved posts
- Delete your own comments
- Moderators can remove any comment

---

### ❤️ Reactions

Supported reactions:

- 👍 Like
- ❤️ Love
- 😂 Haha
- 😮 Wow
- 😢 Sad
- 😡 Angry

Users can:

- Add reaction
- Change reaction
- Remove reaction
- View reaction counts

---

### 🔔 Notifications

Notification support for important events.

Users can:

- View notifications
- View unread notifications
- Mark one as read
- Mark all as read
- Delete notifications

---

### 🛡 Security

Production-ready security includes:

- JWT Authentication
- bcrypt Password Hashing
- Helmet
- CORS
- Compression
- Rate Limiting
- Input Validation
- Centralized Error Handling

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcrypt |
| File Uploads | Multer |
| Email | Nodemailer |
| Security | Helmet, CORS, Compression, Express Rate Limit |

---

# 📁 Project Structure

```
config/
│
├── db.js
├── env.js
│
controllers/
│
├── auth.controller.js
├── users.controller.js
├── groups.controller.js
├── posts.controller.js
├── comments.controller.js
├── reactions.controller.js
└── notifications.controller.js
│
middlewares/
│
├── auth.js
├── authorizeGroupRoles.js
├── errorHandler.js
├── uploads.js
└── resolvePostGroup.js
│
models/
│
├── User.js
├── Group.js
├── GroupMember.js
├── Post.js
├── Comment.js
├── Reaction.js
└── Notification.js
│
routes/
│
├── auth.routes.js
├── users.routes.js
├── groups.routes.js
├── posts.routes.js
├── comments.routes.js
├── reactions.routes.js
└── notifications.routes.js
│
utils/
│
├── asyncHandler.js
├── HttpError.js
├── jwt.js
├── mailer.js
└── multerFactory.js
│
uploads/
│
├── profiles/
├── covers/
├── groups/
└── posts/
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create your `.env` file.


---

## 4. Start Development Server

```bash
npm run dev
```

---

## 5. Production

```bash
npm start
```

---

# 🌍 Environment Variables

The project requires the following environment variables.

| Variable | Required | Description |
|-----------|-----------|-------------|
| `PORT` | ✅ | Server port |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key used to sign JWT tokens |
| Email Variables | Optional | Used for password reset emails |

> **Note:**  
> If email credentials are not configured, password reset emails safely no-op instead of crashing the application. This makes local development easier.

---

# ❤️ Health Check

The API exposes two simple endpoints.

| Method | Endpoint |
|---------|----------|
| GET | `/` |
| GET | `/api/health` |

---

# 🔐 Authentication

Protected endpoints require the following header:

```http
Authorization: Bearer <your-jwt-token>
```

Public endpoints:

- Register
- Login
- Forgot Password
- Reset Password

Everything else requires authentication.

---

# 👥 Group Authorization

Authorization is handled through the `authorizeGroupRoles()` middleware.

The middleware checks the caller's role within the requested group before allowing access.

Supported roles:

- owner
- admin
- member

For routes under:

```
/api/posts/:postId/*
```

the `resolvePostGroup` middleware automatically determines which group the post belongs to before applying authorization rules.

---

# 📚 API Reference

---

## 🔑 Authentication

Base Route

```
/api/auth
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login using email or username |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password/:token` | Reset password |
| GET | `/me` | Get current authenticated user |

---

## 👤 Users

Base Route

```
/api/users
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/?search=` | Search users |
| GET | `/:id` | Get public user profile |
| PUT | `/me` | Update profile |
| PUT | `/me/password` | Change password |
| PUT | `/me/profile-picture` | Upload profile picture |
| PUT | `/me/cover-picture` | Upload cover picture |
| DELETE | `/me` | Delete account |

---

## 👥 Groups

Base Route

```
/api/groups
```

| Method | Endpoint | Role | Description |
|---------|----------|------|-------------|
| POST | `/` | Authenticated | Create group |
| GET | `/?search=` | Public | Search groups |
| GET | `/:groupId` | Public | Group details |
| PUT | `/:groupId` | Owner/Admin | Update group |
| PUT | `/:groupId/logo` | Owner/Admin | Upload logo |
| PUT | `/:groupId/cover` | Owner/Admin | Upload cover |
| DELETE | `/:groupId` | Owner | Delete group |

---

## 👥 Group Members

Base Route

```
/api/groups/:groupId/members
```

| Method | Endpoint | Role | Description |
|---------|----------|------|-------------|
| POST | `/join` | Authenticated | Join group |
| DELETE | `/leave` | Member/Admin | Leave group |
| GET | `/` | Member | List members |
| PATCH | `/:userId/role` | Owner | Change member role |
| DELETE | `/:userId` | Owner/Admin | Remove member |

---

## 📝 Posts

Base Route

```
/api/groups/:groupId/posts
```

| Method | Endpoint | Role | Description |
|---------|----------|------|-------------|
| POST | `/` | Member | Create pending post |
| GET | `/?status=` | Member | List posts |
| GET | `/:postId` | Member | Get single post |
| PUT | `/:postId` | Author | Edit pending post |
| PATCH | `/:postId/approve` | Owner/Admin | Approve post |
| PATCH | `/:postId/reject` | Owner/Admin | Reject post |
| DELETE | `/:postId` | Author/Owner/Admin | Delete post |

---

## 💬 Comments

Base Route

```
/api/posts/:postId/comments
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/` | Add comment |
| GET | `/` | List comments |
| DELETE | `/:commentId` | Delete comment |

---

## ❤️ Reactions

Base Route

```
/api/posts/:postId/reactions
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/` | Add or update reaction |
| DELETE | `/` | Remove reaction |
| GET | `/` | Get reaction summary |

Supported reaction types:

```
like
love
haha
wow
sad
angry
```

---

## 🔔 Notifications

Base Route

```
/api/notifications
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/?unreadOnly=true` | List notifications |
| PATCH | `/:id/read` | Mark one as read |
| PATCH | `/read-all` | Mark all as read |
| DELETE | `/:id` | Delete notification |

---

# 📂 Static Files

Uploaded files are publicly available under:

```
GET /uploads/<subfolder>/<filename>
```

Example:

```
/uploads/profiles/avatar.png
/uploads/groups/logo.png
/uploads/posts/post-image.jpg
```

---

# 📌 Notes

- Images are stored using **Multer**.
- Password reset emails expire after **15 minutes**.
- New posts require moderator approval before becoming visible to regular members.
- Members only see **approved** posts.
- Owners cannot leave their own groups.
- Admins cannot remove other admins.
- Email configuration is optional for local development.

---

