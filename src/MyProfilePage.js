import { useState, useEffect } from "react";
import { authFetch, logout } from "./utils/AuthFetch";

const TABS = ["Profile", "Orders", "Security"];

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  shipped: "bg-blue-50 text-blue-700 border-blue-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

export default function ProfileInfo({ setUser }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    surname: "",
    current_position: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    error: false,
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    authFetch("http://localhost:8000/me")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  useEffect(() => {
    if (activeTab !== "Orders") return;
    setOrdersLoading(true);
    authFetch("http://localhost:8000/my-orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setOrdersLoading(false));
  }, [activeTab]);

  const showToast = (message, error = false) => {
    setToast({ show: true, message, error });
    setTimeout(
      () => setToast({ show: false, message: "", error: false }),
      2500,
    );
  };

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await authFetch("http://localhost:8000/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        surname: profile.surname,
        current_position: profile.current_position,
      }),
    });
    setEditMode(false);
    showToast("Profile updated");
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (passwords.new_password !== passwords.confirm_password) {
      setPwError("New passwords do not match");
      return;
    }
    if (passwords.new_password.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    const res = await authFetch("http://localhost:8000/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      }),
    });
    if (res.ok) {
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      showToast("Password changed successfully");
    } else {
      const data = await res.json();
      setPwError(data.detail || "Failed to change password");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const initials =
    `${profile.name?.[0] || ""}${profile.surname?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mt-10 mx-auto flex flex-col gap-4">
        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-xl flex-shrink-0">
              {initials || "?"}
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-900">
                {profile.name} {profile.surname}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {profile.current_position || "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              Account
            </p>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                Email address
              </label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="w-full text-sm px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>
            <hr className="border-gray-100 my-5" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              Personal info
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First name", name: "name" },
                { label: "Last name", name: "surname" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={profile[name]}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full text-sm px-3 py-2 border rounded-lg outline-none transition-colors ${
                      editMode
                        ? "border-gray-200 focus:border-blue-400 bg-white"
                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">
                  Current position
                </label>
                <input
                  type="text"
                  name="current_position"
                  value={profile.current_position}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full text-sm px-3 py-2 border rounded-lg outline-none transition-colors ${
                    editMode
                      ? "border-gray-200 focus:border-blue-400 bg-white"
                      : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-1.5 text-sm text-gray-500 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100"
                  >
                    Save changes
                  </button>
                </>
              )}
            </div>
            <hr className="border-gray-100 my-5" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              Session
            </p>
            <div className="flex items-center justify-between p-3 rounded-lg border border-red-50 bg-red-50/50">
              <div>
                <p className="text-sm font-medium text-red-600">Sign out</p>
                <p className="text-xs text-red-400 mt-0.5">
                  Sign out of your account on this device
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "Orders" && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              My orders
            </p>
            {ordersLoading ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Loading...
              </p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs text-gray-500"
                        >
                          <span>
                            {item.product?.name} × {item.quantity}
                          </span>
                          <span>${item.subtotal?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-2 flex justify-between">
                      <span className="text-xs text-gray-400">Total</span>
                      <span className="text-sm font-medium text-gray-800">
                        ${order.total_amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "Security" && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              Change password
            </p>
            <div className="flex flex-col gap-4">
              {[
                { label: "Current password", key: "current_password" },
                { label: "New password", key: "new_password" },
                { label: "Confirm new password", key: "confirm_password" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [key]: e.target.value })
                    }
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors bg-white"
                  />
                </div>
              ))}
              {pwError && <p className="text-xs text-red-500">{pwError}</p>}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Update password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 text-sm px-4 py-2.5 rounded-lg border ${
            toast.error
              ? "bg-white border-red-100 text-red-600"
              : "bg-white border-green-100 text-green-700"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
