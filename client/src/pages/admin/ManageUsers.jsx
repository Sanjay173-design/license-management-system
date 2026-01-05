import { useEffect, useState } from "react";
import api from "../../utils/api";
import SkeletonRow from "../../components/SkeletonRow";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/auth/all");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  // Filter + Pagination Logic
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const fetchUsers = async () => {
    const res = await api.get("/auth/all");
    setUsers(res.data);
  };

  const changeRole = async (userId, newRole) => {
    try {
      await api.put("/auth/role", { userId, role: newRole });
      fetchUsers(); // refresh list
    } catch (err) {
      alert("Role update failed");
    }
  };

  const toggleStatus = async (userId) => {
    try {
      await api.put("/auth/status", { userId });
      fetchUsers(); // refresh after update
    } catch (err) {
      alert("Status change failed");
    }
  };

  if (loading) {
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex items-center gap-2">
          <label className="font-medium border px-2 py-1 rounded">Search</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border px-2 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Change Role</th>
              <th className="p-3 text-left">Block User</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((u, index) => (
              <tr
                key={u._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>

                {/* ROLE COLUMN */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold w-20 inline-flex justify-center ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </td>

                {/* CHANGE ROLE COLUMN */}
                <td className="p-3">
                  <button
                    onClick={() =>
                      changeRole(u._id, u.role === "admin" ? "user" : "admin")
                    }
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                  >
                    Change
                  </button>
                </td>

                {/* ACTIONS COLUMN */}
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className={`font-semibold px-3 py-1 rounded text-sm ${
                      u.status === "ACTIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-2 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {Math.ceil(filtered.length / pageSize)}
        </span>

        <button
          disabled={page * pageSize >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
