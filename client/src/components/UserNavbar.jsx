import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h1 className="text-xl font-bold">License Management System</h1>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
