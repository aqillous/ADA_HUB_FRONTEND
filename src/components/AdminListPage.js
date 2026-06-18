import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import DeleteModal from "./DeleteModal";
import { authFetch } from "../utils/AuthFetch";

export default function AdminListPage({
  title,
  fetchUrl,
  deleteUrl,
  editUrl,
  addLink,
  editFields, // [{name, type, label}]
  showImageColumn = false, // Only Products page sets this to true
}) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Load items
  useEffect(() => {
    authFetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error);
  }, [refresh, fetchUrl]);

  // Delete item
  const handleDelete = () => {
    authFetch(`${deleteUrl}/${selectedId}`, { method: "DELETE" })
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== selectedId));
        setShowDeleteModal(false);
        setSelectedId(null);
      })
      .catch(console.error);
  };

  // Edit item
  const handleEdit = async () => {
    const formData = new FormData();

    editFields.forEach((field) => {
      const value = selectedItem[field.name];

      if (field.type === "file" && value instanceof File) {
        formData.append(field.name, value);
      } else if (field.type !== "file") {
        formData.append(field.name, value);
      }
    });

    try {
      await authFetch(`${editUrl}/${selectedItem.id}/edit`, {
        method: "PATCH",
        body: formData,
      });
      setShowEditModal(false);
      setRefresh((p) => !p);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {title && (
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">No items yet.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                {showImageColumn && (
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800  w-32 ">
                    Item
                  </th>
                )}

                {editFields
                  .filter((f) => f.name !== "image")
                  .map((field) => (
                    <th
                      key={field.name}
                      className="px-6 py-3 text-left text-sm font-bold text-gray-800 "
                    >
                      {field.label}
                    </th>
                  ))}

                <th className="px-6 py-3 text-center text-sm font-bold text-gray-800  w-44">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={(e) => {
                    if (!e.target.closest("button")) {
                      // row click, if needed
                    }
                  }}
                >
                  {showImageColumn && (
                    <td className="px-6 py-4 w-32 text-center">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border mx-auto"
                        />
                      )}
                    </td>
                  )}

                  {editFields
                    .filter((f) => f.name !== "image")
                    .map((field) => (
                      <td
                        key={field.name}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {item[field.name] || "-"}
                      </td>
                    ))}

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <EditButton
                        onEdit={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setShowEditModal(true);
                        }}
                      />
                      <DeleteButton
                        onDelete={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          to={addLink}
          className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 font-semibold"
        >
          + Add
        </Link>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          label="item"
          YesClick={handleDelete}
          NoClick={() => setShowDeleteModal(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit</h2>

            <div className="flex flex-col gap-3">
              {editFields.map((field) => {
                const value = selectedItem[field.name];

                if (field.type === "file") {
                  const previewUrl =
                    selectedItem[field.name] instanceof File
                      ? URL.createObjectURL(selectedItem[field.name])
                      : selectedItem.image_url || "";

                  return (
                    <div
                      key={field.name}
                      className="flex flex-col items-center gap-2"
                    >
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-40 h-40 object-cover rounded shadow"
                        />
                      )}

                      <div
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer w-full"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          setSelectedItem((prev) => ({
                            ...prev,
                            [field.name]: file,
                          }));
                        }}
                      >
                        <input
                          type="file"
                          className="hidden"
                          id={`edit-${field.name}`}
                          accept="image/*"
                          onChange={(e) =>
                            setSelectedItem((prev) => ({
                              ...prev,
                              [field.name]: e.target.files[0],
                            }))
                          }
                        />
                        <label
                          htmlFor={`edit-${field.name}`}
                          className="cursor-pointer"
                        >
                          {!previewUrl ? (
                            <div className="text-gray-500">
                              <p className="font-medium">
                                Drag & drop image here
                              </p>
                              <p className="text-sm">or click to upload</p>
                            </div>
                          ) : (
                            <span className="text-blue-500 text-sm">
                              Change image
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  );
                }

                return (
                  <input
                    key={field.name}
                    value={value || ""}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        [field.name]: e.target.value,
                      })
                    }
                    type={field.type || "text"}
                    className="border p-3 rounded"
                  />
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
