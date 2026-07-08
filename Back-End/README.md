# Community Social Media Platform — Backend

A group-based social networking API built with **Express.js**, **Node.js**, and **MongoDB (Mongoose)**. Supports communities/groups with role-based permissions (Owner / Admin / Member), post moderation, comments, reactions, and notifications.

## Tech Stack
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- JWT authentication
- bcrypt password hashing
- Multer file uploads (profile pictures, group images, post images)
- Nodemailer (password reset emails, optional)
- helmet, cors, compression, express-rate-limit for production hardening

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # nodemon, local development
npm start                # production
```

The server exposes a health check at `GET /api/health` and root `GET /`.

## Environment Variables
See `.env.example` for the full list. Required: `MONGODB_URI`, `JWT_SECRET`, `PORT`. Email vars are optional — if omitted, the mailer no-ops instead of crashing (useful for local dev).

## Project Structure
```
config/          Environment variables & DB connection
controllers/     Business logic per resource
routes/          Express routers, mounted under /api
models/          Mongoose schemas
middlewares/     auth, role-based authorization, error handling, uploads
utils/           HttpError, asyncHandler, multer factories, mailer, JWT helper
uploads/         User-uploaded images (profiles/groups/posts), gitignored
```

## Authentication & Authorization
- `Authorization: Bearer <token>` header required on all routes except register/login/forgot-password/reset-password.
- Group-scoped routes use `authorizeGroupRoles(...roles)` middleware, which checks the caller's `GroupMember` role (`owner` / `admin` / `member`) for that specific group.
- Comments and reactions live under `/api/posts/:postId/...`; a small middleware (`resolvePostGroup`) loads the post first to determine which group's role rules apply.

## API Reference

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Login with email or username + password |
| POST | `/forgot-password` | Sends a 15-min reset link via email |
| POST | `/reset-password/:token` | Set a new password |
| GET | `/me` | Get the logged-in user |

### Users — `/api/users`
| Method | Route | Description |
|---|---|---|
| GET | `/?search=` | Search users |
| GET | `/:id` | Get a user's public profile |
| PUT | `/me` | Update name/username/bio |
| PUT | `/me/password` | Change password |
| PUT | `/me/profile-picture` | Upload profile picture (`multipart/form-data`, field `profilePicture`) |
| PUT | `/me/cover-picture` | Upload cover picture (field `coverPicture`) |
| DELETE | `/me` | Delete own account |

### Groups — `/api/groups`
| Method | Route | Role required | Description |
|---|---|---|---|
| POST | `/` | any authenticated user | Create a group (creator becomes Owner) |
| GET | `/?search=` | any | List/search groups |
| GET | `/:groupId` | any | Group details + your role |
| PUT | `/:groupId` | owner, admin | Update name/description |
| PUT | `/:groupId/logo` | owner, admin | Upload logo (field `logo`) |
| PUT | `/:groupId/cover` | owner, admin | Upload cover (field `cover`) |
| DELETE | `/:groupId` | owner | Delete group and all its content |

### Group Members — `/api/groups/:groupId/members`
| Method | Route | Role required | Description |
|---|---|---|---|
| POST | `/join` | any authenticated user | Join a group as Member |
| DELETE | `/leave` | member/admin | Leave a group (owners can't leave) |
| GET | `/` | owner, admin, member | List members |
| PATCH | `/:userId/role` | owner | Promote/demote to admin/member |
| DELETE | `/:userId` | owner, admin | Remove a member (admins can't remove other admins) |

### Posts — `/api/groups/:groupId/posts`
| Method | Route | Role required | Description |
|---|---|---|---|
| POST | `/` | owner, admin, member | Create a post (`multipart/form-data`, field `images`, up to 5). Starts as `pending`. |
| GET | `/?status=` | owner, admin, member | List posts. Regular members only ever see `approved` posts; moderators can filter by status. |
| GET | `/:postId` | owner, admin, member | Get a single post (pending posts visible only to author/moderators) |
| PUT | `/:postId` | author (while pending) | Edit a pending post |
| PATCH | `/:postId/approve` | owner, admin | Approve a pending post |
| PATCH | `/:postId/reject` | owner, admin | Reject a pending post |
| DELETE | `/:postId` | author, owner, admin | Delete a post |

### Comments — `/api/posts/:postId/comments`
| Method | Route | Description |
|---|---|---|
| POST | `/` | Add a comment (group members only, post must be approved unless you're the author/moderator) |
| GET | `/` | List comments |
| DELETE | `/:commentId` | Delete own comment, or any comment as owner/admin |

### Reactions — `/api/posts/:postId/reactions`
| Method | Route | Description |
|---|---|---|
| POST | `/` | Set/change your reaction (`like`, `love`, `haha`, `wow`, `sad`, `angry`) |
| DELETE | `/` | Remove your reaction |
| GET | `/` | Get counts + your current reaction |

### Notifications — `/api/notifications`
| Method | Route | Description |
|---|---|---|
| GET | `/?unreadOnly=true` | List notifications |
| PATCH | `/:id/read` | Mark one as read |
| PATCH | `/read-all` | Mark all as read |
| DELETE | `/:id` | Delete a notification |

Static uploaded files are served from `GET /uploads/<subfolder>/<filename>`.


