import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6">
          {/* CHILD ROUTES RENDER HERE */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
