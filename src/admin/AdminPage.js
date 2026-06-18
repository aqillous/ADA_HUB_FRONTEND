import { useOutletContext } from "react-router-dom";

function AdminPage() {
  const { adminData } = useOutletContext();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome, {adminData.email}
      </h1>
      <p className="text-gray-500 mb-4">
        Role: {adminData.is_admin ? "Super Admin" : "Admin"} | User ID:{" "}
        {adminData.user_id}
      </p>
      <p className="text-gray-600">
        Use the sidebar to navigate through the admin panel.
      </p>
    </div>
  );
}

export default AdminPage;
