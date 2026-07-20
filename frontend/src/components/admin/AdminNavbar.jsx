// src/components/admin/AdminNavbar.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, UserRound, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const pageTitles = {
  "/admin": "Dashboard Admin",
  "/admin/siswa": "Kelola Data Siswa",
  "/admin/guru": "Kelola Data Guru",
  "/admin/orangtua": "Kelola Data Orang Tua",
  "/admin/kelas": "Kelola Data Kelas",
  "/admin/absensi": "Kelola Absensi",
  "/admin/pengumuman": "Kelola Pengumuman",
  "/admin/pembayaran": "Verifikasi Pembayaran SPP",
  "/admin/pengguna": "Kelola Pengguna",
  "/admin/laporan-guru": "Laporan Guru",
};

export default function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Dashboard Admin";

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

  // Handle logout
  const handleLogout = async () => {
    try {
      // Tutup dropdown profile
      setProfileOpen(false);
      
      // Panggil fungsi logout dari hook useAuth
      await logout();
      
      // Redirect ke halaman login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  const initials = (user?.name || "A")
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
          <button
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Notifikasi"
          >
            <Bell size={20} strokeWidth={2} />
            {/* Badge notifikasi */}
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-slate-800">
                  {user?.name || "Admin"}
                </span>
                <span className="block text-[11px] capitalize leading-tight text-slate-400">
                  Admin
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user?.name || "Admin"}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.email || "admin@sekolah.com"}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-[#3C8A7D]/10 px-2 py-0.5 text-[10px] font-medium text-[#3C8A7D]">
                    Administrator
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    // Navigasi ke profil
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserRound size={16} /> Profil Saya
                </button>
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    // Navigasi ke pengaturan
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={16} /> Pengaturan
                </button>
                <div className="my-1 h-px bg-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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