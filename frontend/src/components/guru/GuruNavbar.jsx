import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut, UserRound, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import pengumumanService from "../../services/pengumumanService";
import Modal from "../common/Modal";

const pageTitles = {
  "/guru/dashboard": "Dashboard Guru",
  "/guru/siswa": "Data Siswa",
  "/guru/absensi": "Absensi",
  "/guru/kegiatan": "Kegiatan Harian",
  "/guru/perkembangan": "Perkembangan Anak",
  "/guru/raport": "Raport",
  "/guru/laporan": "Laporan",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function GuruNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Panel Guru";

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [pengumuman, setPengumuman] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedPengumuman, setSelectedPengumuman] = useState(null);
  const notifRef = useRef(null);

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

  useEffect(() => {
    async function fetchPengumuman() {
      try {
        const data = await pengumumanService.getAll();
        setPengumuman(data);

        const lastSeen = localStorage.getItem("pengumuman_last_seen");
        const lastSeenDate = lastSeen ? new Date(lastSeen) : null;

        const unread = lastSeenDate
          ? data.filter((p) => new Date(p.createdAt) > lastSeenDate).length
          : data.length;

        setUnreadCount(unread);
      } catch (err) {
        console.error("Gagal mengambil pengumuman:", err);
      }
    }

    fetchPengumuman();
    const interval = setInterval(fetchPengumuman, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    setNotifOpen((v) => !v);
    setProfileOpen(false);

    if (!notifOpen) {
      localStorage.setItem("pengumuman_last_seen", new Date().toISOString());
      setUnreadCount(0);
    }
  };

  const handleItemClick = (item) => {
    setSelectedPengumuman(item);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || "G")
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
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleBellClick}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <Bell size={20} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF6F59] px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/5">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">Pengumuman</p>
                </div>

                {pengumuman.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-400">
                    Belum ada pengumuman.
                  </p>
                ) : (
                  pengumuman.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleItemClick(p)}
                      className="block w-full border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {p.title}
                        </p>
                        {p.priority === "penting" && (
                          <span className="shrink-0 rounded-full bg-[#FF6F59]/10 px-2 py-0.5 text-[10px] font-medium text-[#FF6F59]">
                            Penting
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {p.content}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {new Date(p.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

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
                  {user?.name || "Guru"}
                </span>
                <span className="block text-[11px] capitalize leading-tight text-slate-400">
                  Guru
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
                    {user?.name || "Guru"}
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

      <Modal
        isOpen={!!selectedPengumuman}
        title={selectedPengumuman?.title}
        onClose={() => setSelectedPengumuman(null)}
      >
        {selectedPengumuman && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                {selectedPengumuman.category}
              </span>
              {selectedPengumuman.priority === "penting" && (
                <span className="rounded-full bg-[#FF6F59]/10 px-2.5 py-1 text-xs font-medium text-[#FF6F59]">
                  Penting
                </span>
              )}
            </div>

            <p className="whitespace-pre-line text-sm text-slate-700">
              {selectedPengumuman.content}
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <span>
                {new Date(selectedPengumuman.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {selectedPengumuman.time && ` • ${selectedPengumuman.time}`}
              </span>
              <span>Oleh: {selectedPengumuman.author?.username || "-"}</span>
            </div>

            {selectedPengumuman.fileName && (
              <a
                href={`${API_BASE_URL}/uploads/pengumuman/${selectedPengumuman.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                📎 {selectedPengumuman.fileName} ({selectedPengumuman.fileSize})
              </a>
            )}
          </div>
        )}
      </Modal>
    </header>
  );
}