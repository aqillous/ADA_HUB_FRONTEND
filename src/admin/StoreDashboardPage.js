import { useEffect, useState } from "react";
import { authFetch } from "../utils/AuthFetch";
import API_BASE_URL from "../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function StoreDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/admin/store/dashboard`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: "Revenue", value: `$${stats.totalRevenue}` },
          { label: "Orders", value: stats.totalOrders },
          { label: "Avg Order", value: `$${stats.avgOrder}` },
          { label: "Today", value: stats.ordersToday },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">
            Revenue Over Time
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.revenueChart}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Orders</h2>

          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersChart}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="orders" fill="#374151" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">
            Top Products
          </h2>

          <div className="space-y-3">
            {stats.topProducts.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-medium">{p.sold} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">
            Recent Orders
          </h2>

          <div className="space-y-3 text-sm">
            {stats.recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between">
                <span>#{o.id}</span>
                <span>${o.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
