import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // No token? Redirect to login and remember where user tried to go
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
  }
  // Has token? Show the protected page
  return children;
}
