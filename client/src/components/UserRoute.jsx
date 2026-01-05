import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "user") {
    return <Navigate to="/user" />;
  }

  return children;
}
