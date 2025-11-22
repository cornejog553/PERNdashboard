import logo from "../assets/CleaningLogo.png";
import dashboardLogo from "../assets/Dashboard logo.svg";
import bookingIcon from "../assets/Booking Icon.svg";
import customerIcon from "../assets/Customers Icon.svg";
import cleanerIcon from "../assets/cleanerIcon.svg";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
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
          <div>Cleaning Crafters</div>
        </div>
        <div className="flex flex-row justify-start ml-5 hover:bg-blue-600 hover:text-white">
          <div className="flex flex-row gap-3 p-2">
            <img src={dashboardLogo} alt="Dashboard icon" 
            className="group-hover:brightness-0 group-hover:invert
            "/>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold hover:text-white" : "hover:text-white"
            }
          >
            Dashboard
          </NavLink>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
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
        <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
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
        <div className="flex flex-row items-center gap-3 p-2 ml-5 hover:bg-blue-600 hover:text-white">
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
