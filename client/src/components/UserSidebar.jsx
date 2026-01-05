import { NavLink } from "react-router-dom";
export default function UserSidebar() {
  return (
    <div className="w-56 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">User</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/licenses"
          className="hover:bg-gray-700 p-2 rounded"
        >
          My Licenses
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
