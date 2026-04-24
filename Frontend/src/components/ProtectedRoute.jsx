import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { session, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <p className="rounded-lg bg-white p-4 text-sm text-slate-600">Checking session...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
