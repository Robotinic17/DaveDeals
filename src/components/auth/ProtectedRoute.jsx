import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSessionUser, getToken } from "../../lib/auth";

function normalizeRoles(roles) {
  if (!roles) return [];
  return Array.isArray(roles) ? roles : [roles];
}

export default function ProtectedRoute({ roles, redirectTo = "/account-signin" }) {
  const location = useLocation();
  const token = getToken();
  const user = getSessionUser();
  const allowedRoles = normalizeRoles(roles);

  if (!token || !user) {
    const next = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`${redirectTo}?next=${encodeURIComponent(next)}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
