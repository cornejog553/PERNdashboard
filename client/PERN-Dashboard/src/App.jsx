import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard";
import BookingCalendar from "./components/BookingCalendar";
import Customers from "./pages/Customers";
import Cleaners from "./pages/Cleaners";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        {/* Protected routes - authentication required, WITH sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* <Route path="bookings" element={<Bookings />} /> */}
          <Route path="bookings" element={<BookingCalendar />} />
          <Route path="customers" element={<Customers />} />
          <Route path="cleaners" element={<Cleaners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
