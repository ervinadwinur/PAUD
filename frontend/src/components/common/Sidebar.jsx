// src/components/common/Sidebar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  X,
  Sprout,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { menuConfig, accentMap } from "../../utils/menuConfig";
import { useAuth } from "../../hooks/useAuth";

/**
 * Sidebar navigasi berbasis role, dengan dua state:
 * - Mobile: overlay penuh, dibuka/ditutup lewat `isOpen` / `onClose`
 * - Desktop: bisa di-collapse jadi icon-rail (72px) lewat tombol di footer
 *
 * Props:
 * - isOpen: boolean — status buka/tutup di layar mobile
 * - onClose: fungsi untuk menutup sidebar di mobile
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth(); // { name, role: 'admin' | 'guru' | 'orangtua' }
  const { pathname } = useLocation();
  const role = user?.role || "admin";
  const config = menuConfig[role];
  const accent = accentMap[config.accent];

  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState(() =>
    // Buka otomatis submenu yang memuat route aktif saat pertama render
    config.sections
      .flatMap((s) => s.items)
      .reduce((acc, item) => {
        if (item.children?.some((c) => pathname.startsWith(c.path)))
          acc[item.label] = true;
        return acc;
      }, {}),
  );

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const isChildActive = (children) =>
    children.some((c) => pathname.startsWith(c.path));

  return (
    <>
      {/* Overlay mobile */}
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
        {/* Brand */}
        <div
          className={`flex items-center gap-2.5 px-5 py-5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.bg} shadow-sm`}
          >
            <Sprout size={19} className="text-white" strokeWidth={2.3} />
          </span>
          <div
            className={`min-w-0 leading-tight ${collapsed ? "lg:hidden" : ""}`}
          >
            <p className="truncate font-display text-[15px] font-bold tracking-tight text-white">
              PAUD Kober Al-Musyawaroh
            </p>
            <p className="truncate text-[11px] text-[#9FB3AC]">
              Sistem Informasi PAUD
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-[#9FB3AC] hover:bg-white/5 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role chip */}
        <div
          className={`px-5 pb-4 ${collapsed ? "lg:flex lg:justify-center lg:px-0" : ""}`}
        >
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${accent.bg} ${collapsed ? "lg:px-1.5 lg:py-1.5" : ""}`}
          >
            {collapsed ? (
              <span className="hidden lg:inline">•</span>
            ) : (
              `Panel ${config.label}`
            )}
            <span
              className={collapsed ? "lg:hidden" : "hidden"}
            >{`Panel ${config.label}`}</span>
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 pb-6 scrollbar-thin">
          {config.sections.map((section) => (
            <div key={section.title}>
              <p
                className={`px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#71897F] ${collapsed ? "lg:sr-only" : ""}`}
              >
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  // Item dengan submenu → accordion
                  if (item.children) {
                    const activeGroup = isChildActive(item.children);
                    const open = !!openGroups[item.label];
                    return (
                      <li key={item.label} className="group relative">
                        <button
                          onClick={() => toggleGroup(item.label)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                            ${activeGroup ? `${accent.bgSoft} text-white` : "text-[#C7D3CD] hover:bg-white/5 hover:text-white"}
                            ${collapsed ? "lg:justify-center" : ""}`}
                        >
                          <Icon
                            size={18}
                            strokeWidth={2}
                            className="shrink-0"
                          />
                          <span
                            className={`flex-1 text-left ${collapsed ? "lg:hidden" : ""}`}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`rounded-full ${accent.bg} px-1.5 py-0.5 text-[10px] font-bold text-white ${collapsed ? "lg:hidden" : ""}`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            size={15}
                            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""} ${collapsed ? "lg:hidden" : ""}`}
                          />
                        </button>

                        {/* Submenu (expanded mode) */}
                        {!collapsed && open && (
                          <ul className="ml-[34px] mt-1 space-y-0.5 border-l border-white/10 pl-3">
                            {item.children.map((child) => (
                              <li key={child.path}>
                                <NavLink
                                  to={child.path}
                                  onClick={onClose}
                                  className={({ isActive }) =>
                                    `block rounded-lg px-3 py-2 text-[13px] transition-colors ${
                                      isActive
                                        ? `${accent.text} font-semibold`
                                        : "text-[#A9B8B2] hover:text-white"
                                    }`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tooltip flyout (collapsed mode, desktop) */}
                        {collapsed && (
                          <div className="pointer-events-none absolute left-full top-0 z-50 ml-2 hidden min-w-[180px] rounded-xl bg-[#1E3D3A] p-1.5 opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 lg:block">
                            <p className="px-2.5 py-1.5 text-xs font-semibold text-white">
                              {item.label}
                            </p>
                            {item.children.map((child) => (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  `block rounded-lg px-2.5 py-1.5 text-[13px] ${
                                    isActive
                                      ? `${accent.text} font-semibold`
                                      : "text-[#C7D3CD] hover:bg-white/5 hover:text-white"
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }

                  // Item biasa (link langsung)
                  return (
                    <li key={item.path} className="group relative">
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                          ${isActive ? `${accent.bg} text-white shadow-sm` : "text-[#C7D3CD] hover:bg-white/5 hover:text-white"}
                          ${collapsed ? "lg:justify-center" : ""}`
                        }
                      >
                        <Icon size={18} strokeWidth={2} className="shrink-0" />
                        <span className={collapsed ? "lg:hidden" : ""}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`ml-auto rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white ${collapsed ? "lg:hidden" : ""}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>

                      {/* Tooltip (collapsed mode, desktop) */}
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

        {/* Footer: user mini-card + tombol collapse (desktop only) */}
        <div className="border-t border-white/10 p-3">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${collapsed ? "lg:justify-center" : ""}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${accent.bg}`}
            >
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </span>
            <div
              className={`min-w-0 leading-tight ${collapsed ? "lg:hidden" : ""}`}
            >
              <p className="truncate text-[13px] font-semibold text-white">
                {user?.name || "Pengguna"}
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
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <ChevronsLeft size={16} />
            )}
            {!collapsed && "Ciutkan menu"}
          </button>
        </div>
      </aside>
    </>
  );
}
