# SyncTask 🚀 | Full-Stack Task Management System

SyncTask is a high-performance, responsive task management application built to help users manage their daily flow with ease. This project was developed as part of the Software Engineering Assessment, focusing on secure authentication, real-time CRUD operations, and a premium UI/UX.

**Live Demo:** https://synctask-web.vercel.app
**Backend API:** https://earnest-fintech-limited-task-management.onrender.com

---

## ✨ Key Features

* **Secure Authentication**: JWT-based Auth with Access & Refresh tokens stored in HttpOnly cookies.
* **Google OAuth 2.0**: One-click social login integration.
* **Smart Dashboard**: Real-time task filtering (Work, Personal, Health, etc.) and sorting by date.
* **Responsive Design**: A "Mobile-First" approach with a dedicated bottom navigation bar for phone users.
* **Dark Mode**: A sleek, persistent dark theme for high-focus environments.
* **Optimized Performance**: Debounced search and React Query for efficient data fetching and caching.

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS (Responsive Utilities)
* **State Management**: TanStack Query (React Query)
* **Icons**: Lucide React

### Backend
* **Server**: Node.js & Express.js
* **Language**: TypeScript
* **Database**: MySQL (Hosted on Railway)
* **ORM**: Prisma
* **Security**: Helmet.js, Bcrypt, and JWT

---

## 📂 Project Architecture

### Backend (Express + TypeScript)

src/
├── config/             # Configuration files (DB, Environment)
├── controllers/        # Request handlers (auth.controller.ts, task.controller.ts)
├── middlewares/        # Custom middleware (auth.middleware.ts, error.middleware.ts)
├── routes/             # API Route definitions (auth.routes.ts, task.routes.ts)
├── services/           # Business logic & DB interaction (auth.service.ts, task.service.ts)
├── types/              # TypeScript interfaces and types
├── utils/              # Helper functions (appError.ts, asyncHandler.ts)
├── validations/        # Zod schemas (auth.validation.ts, task.validation.ts)
├── app.ts              # Express app configuration
└── server.ts           # Server entry point

### Frontend (Next.js 14)

src/
├── app/                # Next.js App Router (Pages & API routes)
│   ├── dashboard/      # Main application dashboard
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── forgot-password/# Password recovery
│   └── reset-password/ # Password reset logic
├── components/         # Reusable UI components (Navbar, TaskCard, TaskForm)
├── hooks/              # Custom React hooks (useAuth.ts)
├── lib/                # Third-party library configs (axios.ts)
├── providers/          # Context providers (QueryProvider.tsx)
└── globals.css         # Global styles

---

## 🗄️ Database Schema (Prisma)

The application uses a relational **MySQL** database managed via **Prisma ORM**, designed for high data integrity, strict user isolation, and efficient querying.

- **User Model** — Stores unique user credentials, profile data, and hashed passwords.
- **Task Model** — Maintains a **1:N (One-to-Many)** relationship with the User. Each task is strictly tied to a `userId`, ensuring users can only access their own data.
- **Key Fields** — Includes `category` (Work, Personal, etc.), `status` (Boolean), and `dueDate` (DateTime) to power advanced dashboard filtering and sorting.

---

## 🔌 API Endpoints

The backend follows **RESTful** principles, providing a clean and predictable interface for the frontend.

### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create a new account & generate initial tokens |
| `POST` | `/auth/login` | Validate credentials & set HttpOnly refresh cookies |
| `POST` | `/auth/refresh` | Rotate Access Token using the Refresh Token |
| `POST` | `/auth/google` | Handle Google OAuth 2.0 verification & login |
| `POST` | `/auth/logout` | Clear session cookies and invalidate current session |

### Tasks (`/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Fetch user tasks (supports `?search=` and category filters) |
| `POST` | `/tasks` | Create a new task entry with title and category |
| `PATCH` | `/tasks/:id` | Update existing task details (title, description, date) |
| `PATCH` | `/tasks/:id/toggle` | Quickly flip completion status (Done/Pending) |
| `DELETE` | `/tasks/:id` | Permanently remove a task from the database |

---

## 🏗️ Architecture & Security

The system follows a decoupled Client-Server architecture. To ensure production-grade security, the following measures were implemented:

1.  **HttpOnly Cookies**: Refresh tokens are stored in secure, same-site cookies to prevent XSS attacks.
2.  **CORS & COOP**: Configured to allow secure communication between Vercel (Frontend) and Render (Backend).
3.  **Zod Validation**: Strict schema validation on both frontend and backend to ensure data integrity.



---

## 🚀 Local Setup

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/your-username/soen-task-management.git](https://github.com/your-username/soen-task-management.git)
    ```

2.  **Install dependencies**:
    ```bash
    # For Frontend
    npm install
    
    # For Backend
    cd server && npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root and server folders:
    ```env
    # Frontend
    NEXT_PUBLIC_API_URL=http://localhost:5000
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id

    # Backend
    DATABASE_URL=your_mysql_url
    JWT_ACCESS_SECRET=your_secret
    JWT_REFRESH_SECRET=your_secret
    ```

4.  **Run the project**:
    ```bash
    npm run dev
    ```

---

## 📈 Future Improvements
* **Drag-and-Drop**: Implement Kanban board views.
* **Push Notifications**: Reminders for upcoming task deadlines.
* **Team Workspaces**: Shared task lists for collaborative projects.

---

**Developed by Priyanka Patel** *Software Engineering Assessment - 2026*
