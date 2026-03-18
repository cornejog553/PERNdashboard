import logo from "../assets/CleaningLogo.png";
import dashboardLogo from "../assets/DashboardLogo.svg";
import bookingIcon from "../assets/BookingIcon.svg";
import customerIcon from "../assets/CustomersIcon.svg";
import cleanerIcon from "../assets/cleanerIcon.svg";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <>
      <div className="flex flex-col bg-white text-gray-600 text-lg font-semibold gap-5 border-r border-gray-200">
        {/* Logo */}
        <div className="flex flex-row items-center justify-around">
          <div>
            <img
              src={logo}
              alt="Cleaning Crafters Logo"
              className="h-30 w-auto"
            />
          </div>
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold hover:text-white"
              : "hover:text-white"
          }
        >
          <div className="flex flex-row justify-start ml-5 hover:bg-blue-600 hover:text-white">
            <div className="flex flex-row gap-3 p-2">
              <img
                src={dashboardLogo}
                alt="Dashboard icon"
                className="group-hover:brightness-0 group-hover:invert
            "
              />
              Dashboard
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
          }
        >
          <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
            <img src={bookingIcon} alt="Dashboard icon" />
            Bookings
          </div>
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
          }
        >
          <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
            <img src={customerIcon} alt="Dashboard icon" />
            Customers
          </div>
        </NavLink>

        <NavLink
          to="/cleaners"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
          }
        >
          <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
            <img src={cleanerIcon} alt="Dashboard icon" />
            Cleaners
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
    </>
  );
}
