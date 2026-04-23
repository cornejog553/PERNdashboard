import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 pt-20 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </>
  );
}
