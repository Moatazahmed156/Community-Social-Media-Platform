# 🐝 Hive — Frontend (Angular)

A modern **community-based social networking platform** built with **Angular 19**, featuring standalone components, signals, the new Angular control-flow syntax, and a fully responsive interface following the **Hive Design System**.

The application provides an intuitive experience for discovering communities, sharing posts, moderating content, interacting through comments and reactions, and managing personal profiles—all while supporting both **Light** and **Dark** themes.

---

# ✨ Features

### 🔐 Authentication
- User registration
- Secure login
- Forgot password
- Reset password
- JWT-based authentication
- Automatic authentication persistence

---

### 👤 User Profiles

- View public profiles
- Edit personal information
- Upload profile picture
- Upload cover picture
- Change password
- Account settings

---

### 👥 Community Management

- Explore communities
- View joined communities
- Create new communities
- Join communities
- Community details page
- Member management
- Community About section

---

### 📝 Social Feed

- Home feed aggregated from joined communities
- Create posts
- Upload multiple images
- Edit pending posts
- Delete posts
- Responsive post cards
- Relative timestamps
- Infinite-ready feed architecture

---

### 🛡 Moderation Workflow

Community moderators can:

- Review pending posts
- Approve posts
- Reject posts
- Delete inappropriate content

Members only see approved posts while moderators have access to the moderation queue.

---

### 💬 Comments

- Add comments
- View comments
- Delete your own comments
- Moderator comment management

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

- Add reactions
- Change reactions
- Remove reactions
- View reaction counts

---

### 🔔 Notifications

- Notification center
- Unread badges
- Read/unread states
- Notification categories
- Mark individual notifications as read
- Mark all notifications as read

---

### 🌙 Dark Mode

- Light & Dark themes
- Theme preference saved in Local Storage
- Automatically follows OS preference on first launch
- Instant theme switching

---

### 📱 Responsive Design

Optimized for:

- Desktop
- Tablet
- Mobile

Includes:

- Desktop sidebar
- Top navigation
- Mobile bottom navigation
- Responsive cards
- Adaptive layouts

---

### ♿ Accessibility

- Semantic HTML
- Proper form labels
- Keyboard navigation
- Visible focus indicators
- Accessible color contrast
- Responsive typography

---

# 🎨 Hive Design System

The entire design system is centralized in **`src/styles.scss`**, making customization and rebranding straightforward.

## Color Palette

| Purpose | Color |
|----------|-------|
| Primary | Honey Yellow `#F4B400` |
| Primary Hover | Amber `#E09F00` |
| Heading | Charcoal |
| Body Text | Dark Gray |
| Secondary Text | Gray |
| Borders | Light Gray |
| Background | White / Dark Theme |

---

## Typography

| Element | Font |
|----------|------|
| Headings | Poppins |
| Body | Inter |

---

## Components

The design system includes:

- Elevated primary buttons
- Rounded cards
- Hover animations
- Loading skeletons
- Fade-in animations
- Responsive spacing
- Theme variables
- Utility classes

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Angular 19 |
| Architecture | Standalone Components |
| State Management | Angular Signals |
| Forms | Reactive Forms |
| HTTP | HttpClient |
| Reactive Programming | RxJS |
| Styling | SCSS |
| Theming | CSS Custom Properties |
| Authentication | JWT |
| Routing | Angular Router |
| Icons | Angular Icons / SVG |
| Notifications | Custom Toast Service |

---

# 📁 Project Structure

```
src/
│
├── app/
│   │
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   │
│   ├── layout/
│   │   ├── auth-layout/
│   │   ├── main-layout/
│   │   ├── sidebar/
│   │   ├── topnav/
│   │   └── bottom-nav/
│   │
│   ├── shared/
│   │   ├── components/
│   │   └── pipes/
│   │
│   └── features/
│       ├── auth/
│       ├── dashboard/
│       ├── communities/
│       ├── notifications/
│       ├── profile/
│       └── settings/
│
├── assets/
├── environments/
└── styles.scss
```

---

# 🚀 Getting Started

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Start Development Server

```bash
npm start
```

The application will be available at:

```
http://localhost:4200
```

---

# ⚙ Backend Configuration

By default, the application communicates with the backend API running locally.

```
http://localhost:5000/api
```

Configuration can be found in:

```
src/environments/environment.ts
```

For production, update:

```
src/environments/environment.prod.ts
```

Configure:

```ts
apiUrl
fileBaseUrl
```

to match your deployed backend.

---

# 🌐 CORS Configuration

Ensure the backend's `CLIENT_URL` environment variable matches the URL where the Angular application is hosted.

Example:

```
Frontend
http://localhost:4200

↓

Backend CLIENT_URL
http://localhost:4200
```

---

# 🏗 Application Architecture

## Core

Contains the application's reusable infrastructure.

- Models
- API Services
- Authentication
- Theme Service
- Toast Service
- Route Guards
- HTTP Interceptors

---

## Layout

Provides the application's shell.

Includes:

- Desktop Sidebar
- Top Navigation
- Bottom Navigation (Mobile)
- Main Layout
- Authentication Layout

---

## Shared

Reusable UI components and utilities.

Includes:

- Avatar
- Post Card
- Community Card
- Toast Container
- Empty State
- Confirmation Dialog
- Time Ago Pipe
- File URL Pipe

---

## Features

Organized by business domain.

### Authentication

- Login
- Register
- Forgot Password
- Reset Password

### Dashboard

- Community feed

### Communities

- Explore
- Joined Communities
- Community Details
- Community Creation

### Notifications

- Notification Center

### Profile

- Public & Personal Profile

### Settings

- Account
- Security
- Appearance
- Notification Preferences

---

# 🔐 Authentication

Authentication is handled using JWT.

Authenticated requests automatically include:

```http
Authorization: Bearer <token>
```

via a functional HTTP interceptor.

Additional authentication features include:

- Automatic token injection
- Auto logout on expired sessions
- Global error handling
- Toast notifications

---

# 🎨 Theme System

The application supports complete Light and Dark themes.

Theme switching is managed by the `ThemeService`.

Features:

- CSS Custom Properties
- Local Storage persistence
- OS preference detection
- Instant switching
- One-file customization through `styles.scss`

---

# 📱 Responsive Navigation

## Desktop

- Sidebar Navigation
- Top Navigation

## Mobile

- Bottom Navigation
- Responsive layouts
- Adaptive cards
- Optimized spacing

---

# ⚡ Angular 19 Features

This project makes use of Angular's latest capabilities:

- Standalone Components
- Angular Signals
- Functional Interceptors
- New Control Flow Syntax (`@if`, `@for`, `@switch`)
- Lazy-loaded Feature Modules
- Reactive Forms
- Modern Dependency Injection

---

# 🎯 Performance

Built with performance in mind.

Features include:

- Signals for efficient state updates
- Lazy-loaded feature routes
- Optimized change detection
- Skeleton loading states
- Image lazy loading
- Lightweight SCSS architecture

---

# 📌 Notes

- All API communication is centralized in dedicated services.
- JWT authentication is automatically managed through HTTP interceptors.
- Theme preferences persist between sessions.
- The design system is fully configurable from `styles.scss`.
- The UI is completely responsive across desktop, tablet, and mobile devices.
- Components are built using Angular standalone architecture for improved maintainability and scalability.

---

