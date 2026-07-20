import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-screen bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;