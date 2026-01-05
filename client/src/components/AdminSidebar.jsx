import { NavLink } from "react-router-dom";
export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 ">
      <h2 className="text-xl font-bold mb-6">Admin</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/admin" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="hover:bg-gray-700 p-2 rounded">
          Manage Users
        </NavLink>

        <NavLink to="/admin/licenses" className="hover:bg-gray-700 p-2 rounded">
          Manage Licenses
        </NavLink>

        <NavLink
          to="/admin/licenses/create"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Create License
        </NavLink>

        <NavLink to="/admin/logs" className="hover:bg-gray-700 p-2 rounded">
          Activity Logs
        </NavLink>
      </nav>
    </div>
  );
}
