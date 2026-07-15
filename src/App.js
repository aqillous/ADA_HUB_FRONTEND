import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import AdminPage from "./admin/AdminPage";
import RegisterPage from "./RegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import UsersPage from "./admin/UsersPage";
import CalendarPage from "./admin/CalendarPage";
import CalendarAddPage from "./admin/CalendarAddPage";
import NewsPage from "./admin/NewsPage";
import NewsAddPage from "./admin/NewsAddPage";
import UserAddPage from "./admin/UsersAddPage";
import StoreDashboardPage from "./admin/StoreDashboardPage";
import StoreAdminLayout from "./layouts/StoreAdminLayout";
import StoreOrdersPage from "./admin/StoreOrdersPage";
import StoreAddProductPage from "./admin/StoreAddProductPage";
import StoreProdutsPage from "./admin/StoreProductsPage";
import ADAStorePage from "./ADAStorePage";
import MyProfile from "./MyProfilePage";
import { authFetch } from "./utils/AuthFetch";
import VPsPage from "./admin/VPsPage";
import API_BASE_URL from "./config";

function MainLayout({ children, user, setUser }) {
  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <div>{children}</div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    authFetch(`${API_BASE_URL}/me`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public pages with navbar */}
        <Route
          path="/"
          element={
            <MainLayout user={user} setUser={setUser}>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/ada-store"
          element={
            <MainLayout user={user} setUser={setUser}>
              <ADAStorePage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout user={user} setUser={setUser}>
              <MyProfile />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<UserAddPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="calendar/add" element={<CalendarAddPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/add" element={<NewsAddPage />} />
          <Route path="vps" element={<VPsPage />} />
          <Route path="/admin/store" element={<StoreAdminLayout />}>
            <Route path="dashboard" element={<StoreDashboardPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="orders" element={<StoreOrdersPage />} />
            <Route path="products" element={<StoreProdutsPage />} />
            <Route path="products/add" element={<StoreAddProductPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
