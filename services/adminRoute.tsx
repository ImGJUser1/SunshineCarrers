import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/not-authorized" replace />;

  return children;
}
