// src/layouts/GuruLayout.jsx
import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

export default function GuruLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();

  const breadcrumb = matches
    .filter((m) => m.handle?.crumb)
    .map((m) => ({ label: m.handle.crumb, path: m.pathname }));

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumb={breadcrumb.length ? breadcrumb : [{ label: "Dashboard" }]}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
