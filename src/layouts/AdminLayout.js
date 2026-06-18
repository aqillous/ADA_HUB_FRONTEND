import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar";
import { authFetch, logout } from "../utils/AuthFetch";

export default function AdminLayout() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchAdmin() {
      try {
        const res = await authFetch("http://localhost:8000/admin");

        if (!res.ok) {
          // Only logout if refresh also failed
          logout();
          return;
        }

        const data = await res.json();
        if (!cancelled) setAdminData(data);
      } catch (err) {
        console.error(err);
        logout();
      }
    }

    fetchAdmin();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!adminData) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen mt-[-8px]">
      <AdminSideBar />
      <main className="flex-1 p-6 ml-60">
        <Outlet context={{ adminData }} />
      </main>
    </div>
  );
}
