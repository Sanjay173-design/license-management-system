import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { logout } = useAuth();

  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">License Management System</h1>

      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
