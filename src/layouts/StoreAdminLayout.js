import { Outlet, NavLink } from "react-router-dom";

export default function StoreAdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar for store */}
      <nav className="bg-white shadow px-6 py-3 flex gap-6">
        <NavLink
          to="/admin/store/dashboard"
          className={({ isActive }) =>
            isActive
              ? "font-bold border-b-2 border-blue-500 pb-1 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/store/orders"
          className={({ isActive }) =>
            isActive
              ? "font-bold border-b-2 border-blue-500 pb-1 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/admin/store/products"
          className={({ isActive }) =>
            isActive
              ? "font-bold border-b-2 border-blue-500 pb-1 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }
        >
          Products
        </NavLink>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
