import React, { useEffect, useState, useRef } from "react";
import { authFetch } from "../utils/AuthFetch";
import DeleteModal from "../components/DeleteModal";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
import API_BASE_URL from "../config";

export default function StoreOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Dropdown state
  const [statusDropdown, setStatusDropdown] = useState({
    visible: false,
    orderId: null,
    top: 0,
    left: 0,
  });
  const tableWrapperRef = useRef(null);

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const fetchOrders = () => {
    setLoading(true);
    authFetch(`${API_BASE_URL}/admin/store/allOrders`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setOrders(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleStatusButtonClick = (e, orderId) => {
    e.stopPropagation();
    const tableRect = tableWrapperRef.current.getBoundingClientRect();
    const rowRect = e.currentTarget.getBoundingClientRect();
    if (statusDropdown.top === 0) {
      setStatusDropdown({
        visible: true,
        orderId,
        top: rowRect.bottom - tableRect.top + 4, // position relative to wrapper
        left: rowRect.right - tableRect.left - 128, // align right
      });
    } else {
      setStatusDropdown({
        visible: false,
        orderId: null,
        top: 0,
        left: 0,
      });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await authFetch(`${API_BASE_URL}/admin/store/order/${orderId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatusDropdown({ ...statusDropdown, visible: false });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await authFetch(`${API_BASE_URL}/admin/store/order/${selectedOrderId}`, {
        method: "DELETE",
      });
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrderId));
      setShowDeleteModal(false);
      setSelectedOrderId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div
          ref={tableWrapperRef}
          className="relative overflow-x-auto shadow rounded-lg bg-white"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest("button")) toggleExpand(order.id);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.user
                        ? `${order.user.name} ${order.user.surname}`
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-sm relative">
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                        onClick={(e) => handleStatusButtonClick(e, order.id)}
                      >
                        {order.status}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      ${order.total_amount || 0}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-red-500 hover:text-red-700 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(order.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedOrders.includes(order.id) && (
                    <tr>
                      <td colSpan={7} className="px-3 py-3 bg-white">
                        <div className="overflow-x-auto  border border-b-0 border-gray-200 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 w-16">
                                  Product
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">
                                  Name
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">
                                  Quantity × Price
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-900">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-gray-50 transition"
                                >
                                  <td className="px-3 py-2">
                                    {item.product?.image_url && (
                                      <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded border border-gray-200"
                                      />
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                                    {item.product?.name || "Product"}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {item.quantity} × ${item.price}
                                  </td>
                                  <td className="px-3 py-2 text-sm font-semibold text-gray-900 text-right">
                                    ${item.subtotal}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Status dropdown rendered outside table but inside wrapper */}
          {statusDropdown.visible && (
            <div
              className="absolute z-50 w-32 bg-white shadow-lg rounded-lg border"
              style={{ top: statusDropdown.top, left: statusDropdown.left }}
            >
              {statusOptions.map((status) => (
                <div
                  key={status}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    orders.find((o) => o.id === statusDropdown.orderId)
                      ?.status === status
                      ? "font-semibold text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    handleStatusChange(statusDropdown.orderId, status)
                  }
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          label="order"
          YesClick={handleDelete}
          NoClick={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
