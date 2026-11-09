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

Create a `.env` file in the root of `/backend`. Refer to .env.example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devstore_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```
> Note: When running locally on your machine, keep localhost:5432 so the backend can reach the PostgreSQL container running via Docker.
---

## 📦 Installation & Setup
Option B: If you want to run the backend locally while keeping database containerized

**Start only the PostgreSQL database from the `root` of the monorepo**
```bash
docker compose up postgres -d
```
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Seed the initial admin user and sample products:
   ```bash
   npx prisma db seed
   ```
   The seed (`prisma/seed.js`) is idempotent and creates:
   * An **administrator account** — e-mail `admin@devstore.com`, password `123456`, role `ADMIN`. It grants access to the Admin Panel and to the admin-only product routes (`POST` / `DELETE /products`). The password is stored hashed with `bcrypt`.
   * Three sample products (T-shirt, mug and mousepad).

   > 🔐 These credentials are for local development and demonstration only. Change the password (or remove the seed step) before any public deployment.

4. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## 🧪 Running Tests

```bash
# Unit tests (src/**/*.spec.ts) - isolated, dependencies mocked, no database required
npm run test

# E2E tests (test/*.e2e-spec.ts) - full app over HTTP, requires a running, migrated database
npm run test:e2e

# Test coverage
npm run test:cov
```

* **Unit:** `auth.service.spec.ts` covers `AuthService.login` (token generation, password never exposed, `UnauthorizedException` on invalid credentials).
* **E2E:** `app.e2e-spec.ts` (public `GET /products`) and `orders.e2e-spec.ts` (`POST /orders` returns `401` without a token and `201` when authenticated).

> ⚠️ E2E tests use the database from your `.env` and create temporary data (user `e2e@test.com`, a test product and its orders), which is cleaned up afterwards and scoped to that data. A dedicated test database is recommended.

## 🧪 Build

```bash
# Production build
npm run build
```