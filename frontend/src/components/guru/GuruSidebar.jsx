import { NavLink } from "react-router-dom";
import {
  X,
  Sprout,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  FileText,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const menuSections = [
  {
    title: "Utama",
    items: [{ label: "Dashboard", path: "/guru/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Kelas Saya",
    items: [
      { label: "Data Siswa", path: "/guru/siswa", icon: Users },
      { label: "Absensi", path: "/guru/absensi", icon: ClipboardCheck },
      { label: "Kegiatan Harian", path: "/guru/kegiatan", icon: BookOpen },
      { label: "Perkembangan Anak", path: "/guru/perkembangan", icon: TrendingUp },
      { label: "Rapor", path: "/guru/rapor", icon: FileText },
    ],
  },
  {
    title: "Lainnya",
    items: [{ label: "Laporan", path: "/guru/laporan", icon: BarChart3 }],
  },
];

export default function GuruSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col
          bg-[#16302C] text-[#E7E2D6] shadow-xl shadow-black/10
          transition-[transform,width] duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${collapsed ? "lg:w-[76px]" : "w-72"}`}
      >
        <div className={`flex items-center gap-2.5 px-5 py-5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3C8A7D] shadow-sm">
            <Sprout size={19} className="text-white" strokeWidth={2.3} />
          </span>
          <div className={`min-w-0 leading-tight ${collapsed ? "lg:hidden" : ""}`}>
            <p className="truncate font-display text-[15px] font-bold tracking-tight text-white">
              Tunas Ceria
            </p>
            <p className="truncate text-[11px] text-[#9FB3AC]">Panel Guru</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-[#9FB3AC] hover:bg-white/5 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 pb-6 scrollbar-thin">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className={`px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71897F] ${collapsed ? "lg:sr-only" : ""}`}>
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="group relative">
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                          ${isActive ? "bg-[#3C8A7D] text-white shadow-sm" : "text-[#C7D3CD] hover:bg-white/5 hover:text-white"}
                          ${collapsed ? "lg:justify-center" : ""}`
                        }
                      >
                        <Icon size={18} strokeWidth={2} className="shrink-0" />
                        <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
                      </NavLink>

                      {collapsed && (
                        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#1E3D3A] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-hover:opacity-100 lg:block">
                          {item.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${collapsed ? "lg:justify-center" : ""}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
              {(user?.name || "G").slice(0, 1).toUpperCase()}
            </span>
            <div className={`min-w-0 leading-tight ${collapsed ? "lg:hidden" : ""}`}>
              <p className="truncate text-[13px] font-semibold text-white">
                {user?.name || "Guru"}
              </p>
              <p className="truncate text-[11px] text-[#9FB3AC]">
                {user?.email || "—"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="mt-1 hidden w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-[#9FB3AC] hover:bg-white/5 hover:text-white lg:flex"
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && "Ciutkan menu"}
          </button>
        </div>
      </aside>
    </>
  );
}