import { useEffect, useState, useRef } from "react";
import { authFetch } from "../utils/AuthFetch";
import Placeholder from "../assets/default-placeholder.png";
import DeleteModal from "../components/DeleteModal";
import API_BASE_URL from "../config";

export default function VPsPage() {
  const [vps, setVps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    position: "",
    image: null,
  });
  const [addPreview, setAddPreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const addFileRef = useRef();

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    position: "",
    image: null,
  });
  const [editPreview, setEditPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const editFileRef = useRef();

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchVPs = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/vps`)
      .then((res) => res.json())
      .then(setVps)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVPs();
  }, []);

  // ── ADD ──────────────────────────────────────────────
  const handleAddImageChange = (file) => {
    setAddForm((p) => ({ ...p, image: file }));
    setAddPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.position) return;
    setAddLoading(true);
    const fd = new FormData();
    fd.append("name", addForm.name);
    fd.append("position", addForm.position);
    if (addForm.image) fd.append("image", addForm.image);

    try {
      await authFetch(`${API_BASE_URL}/admin/vps/add`, {
        method: "POST",
        body: fd,
      });
      setShowAddModal(false);
      setAddForm({ name: "", position: "", image: null });
      setAddPreview(null);
      fetchVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  // ── EDIT ─────────────────────────────────────────────
  const openEdit = (vp) => {
    setEditForm({
      id: vp.id,
      name: vp.name,
      position: vp.position,
      image: null,
    });
    setEditPreview(vp.image_url || null);
    setShowEditModal(true);
  };

  const handleEditImageChange = (file) => {
    setEditForm((p) => ({ ...p, image: file }));
    setEditPreview(file ? URL.createObjectURL(file) : editPreview);
  };

  const handleEditSubmit = async () => {
    if (!editForm.name || !editForm.position) return;
    setEditLoading(true);
    const fd = new FormData();
    fd.append("name", editForm.name);
    fd.append("position", editForm.position);
    if (editForm.image) fd.append("image", editForm.image);

    try {
      await authFetch(`${API_BASE_URL}/admin/vps/${editForm.id}/edit`, {
        method: "PATCH",
        body: fd,
      });
      setShowEditModal(false);
      fetchVPs();
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // ── DELETE ───────────────────────────────────────────
  const handleDelete = async () => {
    await authFetch(`${API_BASE_URL}/admin/vps/${selectedId}`, {
      method: "DELETE",
    });
    setShowDeleteModal(false);
    setSelectedId(null);
    fetchVPs();
  };

  // ── SHARED IMAGE DROP ZONE ───────────────────────────
  const ImageDropZone = ({ preview, onChange, fileRef, inputId }) => (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-blue-400 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) onChange(file);
        }}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={preview}
              alt="preview"
              className="w-36 h-36 object-cover rounded-xl shadow"
            />
            <span className="text-sm text-blue-500">
              Click or drag to change
            </span>
          </div>
        ) : (
          <div className="text-gray-400 py-4">
            <p className="font-medium">Drag & drop photo here</p>
            <p className="text-sm">or click to upload</p>
          </div>
        )}
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Current VPs</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 font-semibold transition"
        >
          + Add VP
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : vps.length === 0 ? (
        <p className="text-gray-500">No VPs yet. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {vps.map((vp) => (
            <div
              key={vp.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <img
                src={vp.image_url || Placeholder}
                alt={vp.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <p className="font-semibold text-gray-900 text-base">
                  {vp.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{vp.position}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(vp)}
                    className="flex-1 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(vp.id);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 py-1.5 text-sm border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-5 text-gray-900">Add New VP</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Position
                </label>
                <input
                  type="text"
                  value={addForm.position}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, position: e.target.value }))
                  }
                  placeholder="e.g. VP of Marketing"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Photo
                </label>
                <ImageDropZone
                  preview={addPreview}
                  onChange={handleAddImageChange}
                  fileRef={addFileRef}
                  inputId="add-vp-image"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddForm({ name: "", position: "", image: null });
                  setAddPreview(null);
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={addLoading || !addForm.name || !addForm.position}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {addLoading ? "Adding..." : "Add VP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-5 text-gray-900">Edit VP</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Position
                </label>
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, position: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Photo
                </label>
                <ImageDropZone
                  preview={editPreview}
                  onChange={handleEditImageChange}
                  fileRef={editFileRef}
                  inputId="edit-vp-image"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={editLoading || !editForm.name || !editForm.position}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <DeleteModal
          label="VP"
          YesClick={handleDelete}
          NoClick={() => {
            setShowDeleteModal(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
