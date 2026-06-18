import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import DeleteModal from "../components/DeleteModal";
import { authFetch } from "../utils/AuthFetch";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserIsAdmin, setSelectedUserIsAdmin] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then(setAllUsers)
      .catch(console.error);
  }, []);

  const handleDelete = () => {
    authFetch(`http://localhost:8000/users/${selectedUserId}`, {
      method: "DELETE",
    })
      .then(() => {
        setAllUsers((prev) =>
          prev.filter((user) => user.id !== selectedUserId),
        );
        setShowDeleteModal(false);
        setSelectedUserId(null);
      })
      .catch(console.error);
  };

  const handleEdit = () => {
    authFetch(
      `http://localhost:8000/users/${selectedUserId}/admin?is_admin=${!selectedUserIsAdmin}`,
      { method: "PATCH" },
    )
      .then(() => {
        setAllUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUserId
              ? { ...user, is_admin: !selectedUserIsAdmin }
              : user,
          ),
        );
        setShowEditModal(false);
        setSelectedUserId(null);
        setSelectedUserIsAdmin(null);
      })
      .catch(console.error);
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Users</h1>

      {allUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* HEADER */}
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 w-44">
                  Actions
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-200">
              {allUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.is_admin
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.is_admin ? "Admin" : "User"}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex justify-center gap-3">
                    <EditButton
                      onEdit={(e) => {
                        e.stopPropagation();
                        setSelectedUserId(user.id);
                        setSelectedUserIsAdmin(user.is_admin);
                        setShowEditModal(true);
                      }}
                    />

                    <DeleteButton
                      onDelete={(e) => {
                        e.stopPropagation();
                        setSelectedUserId(user.id);
                        setShowDeleteModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD BUTTON */}
      <div className="mt-6">
        <Link
          to="/admin/users/add"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 font-semibold"
        >
          + Add
        </Link>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteModal
          label="user"
          YesClick={handleDelete}
          NoClick={() => {
            setShowDeleteModal(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">
              Change role to{" "}
              <span className="text-blue-600 font-bold">
                {selectedUserIsAdmin ? "User" : "Admin"}
              </span>
              ?
            </h2>

            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUserId(null);
                  setSelectedUserIsAdmin(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
