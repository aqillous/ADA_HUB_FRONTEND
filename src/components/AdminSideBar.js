import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
  FaBook,
  FaHistory,
  FaThLarge,
  FaStore,
  FaUserTie,
} from "react-icons/fa";

function AdminSideBar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaHome /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Materials", path: "/admin/materials", icon: <FaBook /> },
    { name: "Calendar", path: "/admin/calendar", icon: <FaCalendarAlt /> },
    { name: "News", path: "/admin/news", icon: <FaNewspaper /> },
    { name: "VPs", path: "/admin/vps", icon: <FaUserTie /> },
    { name: "ADA History", path: "/admin/history", icon: <FaHistory /> },
    { name: "ADA Hub", path: "/admin/hub", icon: <FaThLarge /> },
    { name: "Store", path: "/admin/store", icon: <FaStore /> },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed border-r border-gray-800 shadow-lg mt-2">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Admin Panel
        </h2>
      </div>

      {/* Menu */}
      <ul className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-gray-800 text-white border-l-4 border-red-500"
                      : "hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                {/* Icon */}
                <span
                  className={`text-lg flex items-center justify-center w-5 transition-colors duration-200
                    ${
                      isActive
                        ? "text-red-500"
                        : "text-gray-400 group-hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span className="font-medium tracking-wide">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-800 text-sm text-gray-500">
        © 2026 Admin
      </div>
    </div>
  );
}

export default AdminSideBar;
