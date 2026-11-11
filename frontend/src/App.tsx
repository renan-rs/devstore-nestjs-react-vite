import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminProducts } from "./pages/AdminProducts";
import { Cart } from "./pages/Cart";
import { ProductDetails } from "./pages/ProductDetails";
import { MyOrders } from "./pages/MyOrders";
import { Checkout } from "./pages/Checkout";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />}/>
            <Route path="/cart" element={<Cart />}/>
            <Route path="/orders" element={<MyOrders />}/>
            <Route path="/checkout" element={<Checkout />}/>
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
