import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-shell">
        <div className="page-section py-20 text-center text-[var(--muted-foreground)]">
          Restoring your session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to={user.role === "instructor" ? "/teach" : "/learn"} replace />;
  }

  return children;
}
