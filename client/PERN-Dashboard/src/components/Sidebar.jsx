// components/Sidebar.jsx
import { useState } from "react";
import logo from "../assets/CleaningLogo.png";
import dashboardLogo from "../assets/DashboardLogo.svg";
import bookingIcon from "../assets/BookingIcon.svg";
import customerIcon from "../assets/CustomersIcon.svg";
import cleanerIcon from "../assets/cleanerIcon.svg";
import { useNavigate, NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Only shows on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-4 flex items-center justify-between">
        <img src={logo} alt="Cleaning Crafters Logo" className="h-16 w-auto" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Overlay - Darkens background when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slides in from left */}
      <div
        className={`
          fixed lg:static
          inset-y-0 left-0
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          transition-transform duration-300 ease-in-out
          z-50 lg:z-auto
          w-64
          bg-white
          border-r border-gray-200
          flex flex-col
          mt-20 lg:mt-0
        `}
      >
        {/* Logo - Only shows on desktop */}
        <div className="hidden lg:flex flex-row items-center justify-center p-4 border-b border-gray-200">
          <img
            src={logo}
            alt="Cleaning Crafters Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* User Info - Shows on mobile */}
        <div className="lg:hidden p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">Welcome,</p>
          <p className="font-semibold text-gray-800">{user.full_name || 'User'}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold' : ''
              }`
            }
          >
            <img src={dashboardLogo} alt="Dashboard" className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/bookings"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold' : ''
              }`
            }
          >
            <img src={bookingIcon} alt="Bookings" className="w-5 h-5" />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/customers"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold' : ''
              }`
            }
          >
            <img src={customerIcon} alt="Customers" className="w-5 h-5" />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/cleaners"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold' : ''
              }`
            }
          >
            <img src={cleanerIcon} alt="Cleaners" className="w-5 h-5" />
            <span>Cleaners</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}