import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const res = await api.get("/licenses/dashboard/stats");
      setStats(res.data.stats);
      setRecent(res.data.recent);
    };
    loadStats();
  }, []);

  if (!stats) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Licenses"
          value={stats.total}
          color="bg-gray-200"
        />
        <StatCard title="Active" value={stats.active} color="bg-green-200" />
        <StatCard
          title="Assigned"
          value={stats.assignedNotActivated}
          color="bg-yellow-200"
        />
        <StatCard title="Expired" value={stats.expired} color="bg-red-200" />
      </div>

      {/* Recent Licenses */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Recent Licenses</h2>
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Key</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="p-2">{l.product}</td>
                <td className="p-2">{l.key}</td>
                <td className="p-2 capitalize">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <p className="text-sm text-gray-700">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
