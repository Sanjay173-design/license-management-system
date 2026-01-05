import { useEffect, useState } from "react";
import api from "../../utils/api";
import { downloadFile } from "../../utils/downloadFile";

export default function ManageLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLicenses();
    fetchUsers();
  }, []);

  const fetchLicenses = async () => {
    const res = await api.get("/licenses/all");
    setLicenses(res.data.licenses || res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/auth/all");
    setUsers(res.data);
  };

  const assignLicense = async (licenseId) => {
    try {
      await api.post("/licenses/assign", {
        licenseId,
        userId: selectedUser[licenseId],
      });
      setMessage("License assigned successfully");
      fetchLicenses();
    } catch (err) {
      setMessage("Assignment failed");
    }
  };

  const renewLicense = async (id) => {
    const days = prompt("Enter number of days to extend:");

    if (!days) return;

    await api.put(`/licenses/renew/${id}`, { extendDays: Number(days) });

    fetchLicenses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {/* LEFT — optional heading */}
        <h2 className="text-xl font-semibold">Manage Licenses</h2>

        {/* RIGHT — buttons + filter */}
        <div className="flex items-center gap-3">
          {/* Export buttons group */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                downloadFile(
                  "http://localhost:5000/api/export/licenses/csv",
                  "licenses.csv"
                )
              }
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                downloadFile(
                  "http://localhost:5000/api/export/licenses/xlsx",
                  "licenses.xlsx"
                )
              }
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Export Excel
            </button>

            <button
              onClick={() =>
                downloadFile(
                  "http://localhost:5000/api/export/licenses/pdf",
                  "licenses.pdf"
                )
              }
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Export PDF
            </button>
          </div>

          {/* Filter section */}
          <div className="flex items-center gap-2">
            <label className="px-3 py-1 border rounded bg-gray-100">
              Filter
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="all">All</option>
              <option value="created">Created</option>
              <option value="assigned">Assigned</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {message && <p className="mb-3 text-green-600">{message}</p>}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">License Key</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Assign </th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {licenses
              .filter((l) =>
                statusFilter === "all" ? true : l.status === statusFilter
              )
              .map((l) => (
                <tr key={l._id} className="border-b">
                  <td className="p-2 text-left">{l.key}</td>
                  <td className="p-2 text-left">{l.product}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold w-20 inline-flex justify-center capitalize ${
                        l.status === "active"
                          ? "bg-green-100 text-green-700"
                          : l.status === "assigned"
                          ? "bg-yellow-100 text-yellow-700"
                          : l.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>

                  {/* ASSIGN COLUMN */}
                  <td className="p-2 text-left">
                    {l.status === "created" ? (
                      <select
                        className="border p-1"
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            [l._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select user</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-500 italic">
                        {l.status === "assigned" && "Already assigned"}
                        {l.status === "active" && "Active license"}
                        {l.status === "expired" && "Expired"}
                      </span>
                    )}
                  </td>

                  {/* ACTION COLUMN */}
                  <td className="p-2 text-left">
                    <div className="flex items-center gap-3">
                      {l.status === "created" && (
                        <button
                          disabled={!selectedUser[l._id]}
                          onClick={() => assignLicense(l._id)}
                          className={`px-3 py-1 rounded text-white ${
                            selectedUser[l._id]
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-blue-600 cursor-not-allowed"
                          }`}
                        >
                          Assign
                        </button>
                      )}

                      {(l.status === "assigned" || l.status === "active") && (
                        <span className="px-3 py-1 rounded bg-gray-400 text-white">
                          Assigned
                        </span>
                      )}

                      {l.status === "expired" && (
                        <span className="px-3 py-1 rounded bg-red-200 text-red-700 text-sm">
                          Expired
                        </span>
                      )}
                      {l.status !== "created" && (
                        <button
                          onClick={() => renewLicense(l._id)}
                          className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Renew
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
