// src/components/common/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserRound,
  Settings,
  Search,
  Check,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { accentMap, menuConfig } from "../../utils/menuConfig";


export default function Navbar({
  onMenuClick,
  breadcrumb = [{ label: "Dashboard" }],
  notifications = defaultNotifications,
}) {
  const { user, logout } = useAuth();
  const role = user?.role || "admin";
  const accent = accentMap[menuConfig[role].accent];

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        {/* Kiri: hamburger + breadcrumb */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <nav className="hidden items-center gap-1.5 text-[13px] text-slate-400 sm:flex">
              {breadcrumb.map((item, i) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={13} />}
                  {item.path && i !== breadcrumb.length - 1 ? (
                    <Link to={item.path} className="hover:text-slate-600">
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        i === breadcrumb.length - 1
                          ? "font-medium text-slate-500"
                          : ""
                      }
                    >
                      {item.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="truncate font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {breadcrumb[breadcrumb.length - 1]?.label}
            </h1>
          </div>
        </div>

        {/* Tengah: search (desktop) */}
        <div className="hidden max-w-md flex-1 md:block">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari siswa, guru, atau kelas…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
            />
          </label>
        </div>

        {/* Kanan: search icon (mobile) + notifikasi + profil */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Cari"
          >
            <Search size={20} />
          </button>

          {/* Notifikasi */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <Bell size={20} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6F59] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Notifikasi
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium text-[#3C8A7D] hover:underline">
                    <Check size={13} /> Tandai semua dibaca
                  </button>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="flex gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? accent.bg : "bg-transparent"}`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-slate-800">
                          {n.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {n.desc}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {n.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="block w-full py-2.5 text-center text-xs font-semibold text-[#3C8A7D] hover:bg-slate-50">
                  Lihat semua notifikasi
                </button>
              </div>
            )}
          </div>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* Profil dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${accent.bg}`}
              >
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-slate-800">
                  {user?.name || "Pengguna"}
                </span>
                <span className="block text-[11px] capitalize leading-tight text-slate-400">
                  {role === "orangtua" ? "Orang Tua" : role}
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
                    {user?.name || "Pengguna"}
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
                  onClick={logout}
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

const defaultNotifications = [
  {
    id: 1,
    title: "Pembayaran SPP baru",
    desc: "Ibu Rina membayar SPP Kelas Kelinci",
    time: "5 menit lalu",
    unread: true,
  },
  {
    id: 2,
    title: "Absensi belum diisi",
    desc: "Kelas Kupu-kupu belum absen hari ini",
    time: "1 jam lalu",
    unread: true,
  },
  {
    id: 3,
    title: "Pengumuman baru",
    desc: "Libur semester genap diperbarui",
    time: "Kemarin",
    unread: false,
  },
];
