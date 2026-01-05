import { useEffect, useState } from "react";
import api from "../../utils/api";
import SkeletonRow from "../../components/SkeletonRow";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLicenses = async () => {
    try {
      const res = await api.get("/licenses/my");
      setLicenses(res.data.licenses || res.data);
    } catch (err) {
      setError("Failed to load licenses");
    }
    setLoading(false);
  };

  const activateLicense = async (licenseId) => {
    try {
      await api.post("/licenses/activate", { licenseId });
      fetchLicenses();
    } catch (err) {
      alert(err.response?.data?.error || "Activation failed");
    }
  };

  const daysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Licenses</h1>

      <div className="border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Product</th>
              <th className="p-2">Status</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {licenses.map((lic) => (
              <tr key={lic._id} className="border-b text-center">
                <td className="p-2">{lic.product}</td>

                {/* STATUS BADGE */}
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      lic.status === "active"
                        ? "bg-green-600"
                        : lic.status === "assigned"
                        ? "bg-yellow-500"
                        : lic.status === "expired"
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {lic.status.toUpperCase()}
                  </span>
                </td>

                {/* EXPIRY */}
                <td className="p-2">
                  {lic.validTill ? (
                    lic.status === "expired" ? (
                      <span className="text-red-600 font-semibold">
                        Expired
                      </span>
                    ) : (
                      <span>
                        {new Date(lic.validTill).toLocaleDateString()} <br />
                        <span className="text-sm text-gray-500">
                          ({daysLeft(lic.validTill)} days left)
                        </span>
                      </span>
                    )
                  ) : (
                    "-"
                  )}
                </td>

                {/* ACTION */}
                <td className="p-2">
                  {lic.status === "assigned" && (
                    <button
                      onClick={() => activateLicense(lic._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}

                  {lic.status === "active" && (
                    <span className="text-green-600 font-semibold">In Use</span>
                  )}

                  {lic.status === "expired" && (
                    <span className="text-red-600 font-semibold">
                      Renew Required
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
