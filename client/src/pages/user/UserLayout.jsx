import { Outlet } from "react-router-dom";
import UserSidebar from "../../components/UserSidebar";
import UserNavbar from "../../components/UserNavbar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />

      <div className="flex-1 bg-gray-100">
        <UserNavbar />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
