# 🚀 DevStore - Full Stack E-commerce (Monorepo)

A full-stack e-commerce application built with a monorepo architecture, focused on performance, security (RBAC/JWT), and a complete sales workflow (showcase, shopping cart, checkout, admin panel, and order history).

---

## 🛠️ Tech Stack

### **Backend (`/backend`)**
* **NestJS** (Progressive and modular Node.js framework)
* **Prisma ORM** (Database management and migrations)
* **PostgreSQL** (Relational database)
* **Passport.js & JWT** (Role-based authentication & authorization - RBAC)
* **Bcrypt** (Password hashing)

### **Frontend (`/frontend`)**
* **React** with **Vite** (Fast build tool & strict typing)
* **Tailwind CSS v4** (Modern utility-first styling)
* **Zustand** (Global state management with local storage persistence)
* **React Router** (Client-side routing)
* **Axios** (HTTP client with request interceptors for JWT injection)

### **Infrastructure**
* **Docker & Docker Compose** (Container orchestration for Database, Backend, and Frontend)
* **Nginx** (Production web server for static frontend assets)

---

## 📂 Monorepo Architecture

```text
devstore/
├── backend/           # NestJS API (Modules: Auth, Users, Products, Orders)
├── frontend/          # React + Vite + Tailwind v4 Web Application
├── docker-compose.yml # Environment orchestration
└── README.md          # Project root documentation
```

---

## ⚙️ How to Run the Project

You can run the project using **Docker Compose** (recommended for testing the full environment) or in **Local Development Mode**.

### Method 1: Via Docker Compose (Recommended)

Ensure Docker and Docker Compose are installed on your machine. From the repository root, run:

```bash
docker compose up --build
```

Access the services at:
* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:3000`
* **PostgreSQL Database:** `localhost:5432`

---

### Method 2: Local Development Mode

#### 1. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following environment variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devstore?schema=public"
JWT_SECRET="super-secret-jwt-key"
```

Run database migrations and start the server:
```bash
npx prisma migrate dev
npm run start:dev
```

#### 2. Setup the Frontend
In a new terminal tab, navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🔒 Access Roles & Permissions (RBAC)

* **Customer (`USER`):** Can browse products, view product details, manage cart items, proceed to checkout, view purchase history under *"My Orders"*, and log in or register.
* **Administrator (`ADMIN`):** Has full access to the **Admin Panel** (`/admin/products`) to create, update stock, and delete products from the store.

---

## 🎯 Key Features
- [x] Secure JWT Authentication with bcrypt hashing.
- [x] Role-Based Access Control (`RolesGuard` & `JwtAuthGuard`).
- [x] Responsive product catalog with real-time stock feedback.
- [x] Persistent shopping cart via **Zustand**.
- [x] Complete checkout flow and order history tracking (`MyOrders`).
- [x] Restricted Admin Panel for inventory management.
- [x] Full Docker & Nginx containerization.

---

## 📄 License
Developed by **Renan** as part of the **DevStore** project.