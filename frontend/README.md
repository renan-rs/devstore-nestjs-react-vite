# 💻 DevStore - Frontend Web Client

This is the frontend client for **DevStore**, built using **React**, **Vite**, **Tailwind CSS v4**, and **Zustand**.

---

## 🚀 Features & Pages

* **Home (`/`):** Product catalog with instant additions to cart.
* **Product Details (`/product/:id`):** Full specifications, image preview, and stock availability.
* **Cart (`/cart`):** Persistent shopping cart powered by Zustand with quantity controls and total price updates.
* **Checkout (`/checkout`):** Address details, payment method selection, and order confirmation.
* **My Orders (`/orders`):** Historical record of past orders and statuses.
* **Login/Register (`/login`, `/register`):** User authentication and JWT token handling.
* **Admin Dashboard (`/admin/products`):** Product creation and deletion tool for administrators.

---

## 🛠️ Setup & Scripts

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## 🔌 API Integration

The frontend connects to the NestJS backend via an **Axios** instance located at `src/services/api.ts`. Request interceptors automatically append the JWT authorization token stored in `localStorage` for all protected routes.