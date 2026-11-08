# 🛠️ DevStore - Backend API

This is the backend service for **DevStore**, built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Features & Modules

* **Auth Module (`/auth`):** Handles user registration, authentication, JWT token generation, and Passport strategies.
* **Users Module (`/users`):** User management, password hashing with `bcrypt`, and role management (`USER` / `ADMIN`).
* **Products Module (`/products`):** CRUD operations for products, protected by `RolesGuard` (Admin-only creation and deletion).
* **Orders Module (`/orders`):** Order creation, line item management, total calculation, and order history fetching.

---

## 🛠️ Environment Variables

Create a `.env` file in the root of `/backend`. Refere to .env.example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devstore?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

---

## 📦 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## 🧪 Testing & Build

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Production build
npm run build
```