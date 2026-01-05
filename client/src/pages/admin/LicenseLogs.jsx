import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function LicenseLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/logs/all");
      setLogs(res.data.logs);
    } catch (error) {
      console.error("Logs fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.message?.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">License Activity Logs</h1>

      <input
        type="text"
        placeholder="Search logs..."
        className="border px-2 py-1 rounded mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-xl shadow overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">License</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="p-2">{log.licenseId?.key}</td>
                  <td className="p-2">{log.userId?.email}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.message}</td>
                  <td className="p-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
