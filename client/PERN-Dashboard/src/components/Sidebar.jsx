import logo from "../assets/CleaningLogo.png";
import dashboardLogo from "../assets/Dashboard logo.svg";
import bookingIcon from "../assets/Booking Icon.svg";
import customerIcon from "../assets/Customers Icon.svg";
import cleanerIcon from "../assets/cleanerIcon.svg";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div className="flex flex-col bg-blue-950 text-gray-400 text-lg">
        {/* Logo */}
        <div className="flex flex-row items-center border border-solid border-b-gray-200">
          <div>
            <img
              src={logo}
              alt="Cleaning Crafters Logo"
              className="h-30 w-auto"
            />
          </div>
          <div>Cleaning Crafters</div>
        </div>
        <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
          <img src={dashboardLogo} alt="Dashboard icon" />
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
            }
          >
            Dashboard
          </NavLink>
        </div>
        <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
          <img src={bookingIcon} alt="Dashboard icon" />
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
            }
          >
            Bookings
          </NavLink>
        </div>
        <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
          <img src={customerIcon} alt="Dashboard icon" />
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
            }
          >
            Customers
          </NavLink>
        </div>
        <div className="flex flex-row items-center gap-2 border border-solid border-b-gray-200 p-2">
          <img src={cleanerIcon} alt="Dashboard icon" />
          <NavLink
            to="/cleaners"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
            }
          >
            Cleaners
          </NavLink>
        </div>
      </div>
    </>
  );
}
