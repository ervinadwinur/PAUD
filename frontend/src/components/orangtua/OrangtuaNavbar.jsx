// src/components/orangtua/OrangtuaNavbar.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, UserRound, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const pageTitles = {
  "/orangtua/dashboard": "Dashboard Orang Tua",
  "/orangtua/anak": "Data Anak",
  "/orangtua/absensi": "Absensi",
  "/orangtua/kegiatan": "Kegiatan Harian",
  "/orangtua/raport": "Raport",
  "/orangtua/pembayaran": "Pembayaran SPP",
};

export default function OrangtuaNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Panel Orang Tua";

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || "O")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifikasi">
            <Bell size={20} strokeWidth={2} />
          </button>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-slate-800">
                  {user?.name || "Orang Tua"}
                </span>
                <span className="block text-[11px] capitalize leading-tight text-slate-400">
                  Orang Tua
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/5">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user?.name || "Orang Tua"}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.email || "—"}
                  </p>
                </div>
                <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <UserRound size={16} /> Profil Saya
                </button>
                <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <Settings size={16} /> Pengaturan
                </button>
                <div className="my-1 h-px bg-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#FF6F59] hover:bg-[#FF6F59]/5"
                >
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
