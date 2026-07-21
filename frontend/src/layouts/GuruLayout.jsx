// src/layouts/GuruLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GuruSidebar from "../components/guru/GuruSidebar";
import GuruNavbar from "../components/guru/GuruNavbar";

// Mapping path -> label breadcrumb (sesuaikan dengan route guru kamu)
const BREADCRUMB_MAP = {
  "/guru/dashboard": "Dashboard",
  "/guru/kelas": "Kelas",
  "/guru/absensi": "Absensi",
  "/guru/kegiatan-harian": "Kegiatan Harian",
  "/guru/perkembangan": "Perkembangan Anak",
  "/guru/rapor": "Rapor",
};

export default function GuruLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const label = BREADCRUMB_MAP[location.pathname];
  const breadcrumb = label ? [{ label }] : [{ label: "Dashboard" }];

  return (
    <div className="flex h-screen bg-slate-50">
      <GuruSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <GuruNavbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumb={breadcrumb}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}