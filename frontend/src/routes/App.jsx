import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ProductsPage } from "../pages/ProductsPage.jsx";
import { CustomersPage } from "../pages/CustomersPage.jsx";
import { OrdersPage } from "../pages/OrdersPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
