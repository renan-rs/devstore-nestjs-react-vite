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
Option B: If you want to run the backend locally while keeping database containerized

**Start only the PostgreSQL database from the root of the monorepo**
```bash
docker compose up postgres -d
```

#### 1. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following environment variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devstore_db?schema=public"
JWT_SECRET="super-secret-jwt-key"
```
> Note: When running locally on your machine, keep localhost:5432 so the backend can reach the PostgreSQL container running via Docker.

Run database migrations and start the server:
```bash
npx prisma migrate dev
npx prisma db seed
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

## 🧪 Testing

The backend ships with two complementary test layers, both built on **Jest**. All commands below are run from `/backend`.

| Type | Location | Command | Needs database? |
|------|----------|---------|-----------------|
| **Unit** | `src/**/*.spec.ts` | `npm run test` | No (dependencies are mocked) |
| **End-to-end (E2E)** | `test/*.e2e-spec.ts` | `npm run test:e2e` | **Yes** |

### Unit tests
Exercise a single class in isolation, with collaborators replaced by mocks. They are fast and require no infrastructure.
- `auth.service.spec.ts` covers `AuthService.login`: successful login (access token returned, password hash never exposed) and `UnauthorizedException` on invalid credentials.

### E2E tests (Supertest)
Boot the full NestJS application and issue real HTTP requests against a real PostgreSQL database, validating routing, validation, guards, JWT authentication and persistence together.
- `app.e2e-spec.ts`: public product listing (`GET /products`).
- `orders.e2e-spec.ts`: order placement flow. Verifies that `POST /orders` returns `401` without a token and `201` for an authenticated user.

> ⚠️ **E2E prerequisites:** the database must be running and migrated (`docker compose up postgres -d` and `npx prisma migrate dev`). The tests use the database defined in `backend/.env` and create temporary records (a test user `e2e@test.com`, a test product and their orders). These are removed in `afterAll`, and the cleanup is scoped to the data created by the test. Even so, prefer a dedicated database for testing rather than one holding data you care about.

Other useful commands: `npm run test:watch` and `npm run test:cov` (coverage report).

---

## 🔑 Default Administrator Account (Database Seed)

Running `npx prisma db seed` (executed automatically on container start when using Docker Compose) provisions the database with an administrator account and sample catalog data. The seed is **idempotent**: it uses `upsert` for the admin user and checks product names before inserting, so it is safe to run multiple times.

| Field | Value |
|-------|-------|
| **Name** | Admin DevStore |
| **E-mail** | `admin@devstore.com` |
| **Password** | `123456` |
| **Role** | `ADMIN` |

This account grants access to the **Admin Panel** (`/admin/products`) for managing the product catalog. The password is stored hashed with `bcrypt`.

> 🔐 **Security notice:** these credentials are intended **for local development and demonstration only**. Never deploy to a production environment with the default password. Change the password (or remove the seed step) before exposing the application publicly.

The seed also creates three sample products (T-shirt, mug and mousepad) so the storefront is populated on first run.

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