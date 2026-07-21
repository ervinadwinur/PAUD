// src/layouts/OrangtuaLayout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import OrangtuaSidebar from "../components/orangtua/OrangtuaSidebar";
import OrangtuaNavbar from "../components/orangtua/OrangtuaNavbar";

const OrangtuaLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <OrangtuaSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <OrangtuaNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-screen bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrangtuaLayout;