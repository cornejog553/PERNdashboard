import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <>
      <div className="grid grid-cols-[300px_1fr] h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}
