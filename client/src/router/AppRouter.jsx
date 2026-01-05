import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/user/Login";
import Register from "../pages/user/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import UserRoute from "../components/UserRoute";

// Admin
import AdminLayout from "../pages/admin/AdminLayout";
import AdminHome from "../pages/admin/AdminHome";
import ManageUsers from "../pages/admin/ManageUsers";
import CreateLicense from "../pages/admin/CreateLicense";
import ManageLicenses from "../pages/admin/ManageLicenses";
import LicenseLogs from "../pages/admin/LicenseLogs";

// User
import UserDashboard from "../pages/user/UserDashboard";
import Licenses from "../pages/user/Licenses";
import Profile from "../pages/user/Profile";
import UserLayout from "../pages/user/UserLayout";

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserRoute>
              <UserLayout />
            </UserRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="licenses" element={<Licenses />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="licenses" element={<ManageLicenses />} />
        <Route path="licenses/create" element={<CreateLicense />} />
        <Route path="logs" element={<LicenseLogs />} />
      </Route>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserRoute>
              <Profile />
            </UserRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/password"
        element={
          <ProtectedRoute>
            <UserRoute>{/* <ChangePassword /> */}</UserRoute>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />

      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <LicenseLogs />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
