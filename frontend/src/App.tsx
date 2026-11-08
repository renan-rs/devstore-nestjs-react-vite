import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminProducts } from "./pages/AdminProducts";
import { Cart } from "./pages/Cart";
import { ProductDetails } from "./pages/ProductDetails";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
