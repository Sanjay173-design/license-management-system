import { useEffect, useState } from "react";
import api from "../../utils/api";
import SkeletonRow from "../../components/SkeletonRow";

export default function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="p-6">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard
          title="Total Licenses"
          value={stats.totalLicenses}
          color="purple"
        />
        <StatCard
          title="Active Licenses"
          value={stats.activeLicenses}
          color="green"
        />
        <StatCard
          title="Expired Licenses"
          value={stats.expiredLicenses}
          color="red"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`p-6 rounded shadow ${colors[color]}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
