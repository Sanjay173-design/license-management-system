import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.put("/auth/password", {
        oldPassword,
        newPassword,
      });

      setMessage("✅ Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed");
    }
  };

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        {/* USER INFO */}
        <div className="mb-6">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user.role}</span>
          </p>
        </div>

        <hr className="mb-6" />

        {/* CHANGE PASSWORD */}
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {message && <p className="mb-3 text-blue-600 font-medium">{message}</p>}

        <form onSubmit={handlePasswordChange}>
          <label className="block mb-2">Old Password</label>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
