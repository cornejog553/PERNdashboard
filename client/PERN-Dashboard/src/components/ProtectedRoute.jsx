import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  
  if (!token) {
    // No token? Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Has token? Show the page
  return children;
}