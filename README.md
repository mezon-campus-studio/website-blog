# Memorizz Blog Application

A premium, full-stack gallery for technical knowledge and stories.

## Features
- **Modern UI/UX**: Built with Next.js, Tailwind CSS, and Framer Motion for a stunning, glassmorphism-inspired design.
- **Authentication**: JWT-based authentication with Social Logins (Google & GitHub).
- **Interactive Posts**: Create, read, and manage posts with TipTap rich text editor.
- **Social Features**: Like, bookmark, share, and comment on stories.
- **Real-time Notifications**: Instant updates powered by Socket.io.
- **Secure Backend**: Express REST API integrated with Prisma ORM and MySQL.

## Project Structure
This repository contains two main parts:
- `blog-fe`: Next.js 15 Frontend
- `blog-be`: Node.js/Express Backend

## Technologies Used

### Frontend (`blog-fe`)
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- Zustand (State Management)
- React Query (Data Fetching)
- TipTap (Rich Text Editor)
- Socket.io Client
- Sonner (Notifications)

### Backend (`blog-be`)
- Node.js & Express
- TypeScript
- Prisma ORM
- MySQL
- Socket.io (WebSocket Server)
- Passport.js (OAuth2 Authentication)
- Cloudinary (Image Uploads)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database
- Cloudinary Account (for image hosting)
- Google Cloud Console & GitHub Developer Apps (for OAuth)

### 1. Installation

First, install dependencies in both the backend and frontend directories:

```bash
# Install backend dependencies
cd blog-be
npm install

# Install frontend dependencies
cd ../blog-fe
npm install
```

### 2. Environment Variables

#### Backend (`blog-be/.env`)
Create a `.env` file in the `blog-be` directory:
```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
JWT_SECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

#### Frontend (`blog-fe/.env.local`)
Create a `.env.local` file in the `blog-fe` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup

Navigate to the backend and run the Prisma migrations:

```bash
cd blog-be
npx prisma migrate dev
```

### 4. Running the Application

You need to run both the frontend and backend servers.

**Terminal 1 - Backend Server:**
```bash
cd blog-be
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

**Terminal 2 - Frontend Server:**
```bash
cd blog-fe
npm run dev
```
*(The frontend runs on `http://localhost:3000`)*

---

## Authors
- Developed as a high-end community blogging platform.
