// src/pages/guru/Dashboard.jsx
import { useEffect, useState } from "react";
import { Users, ClipboardCheck, BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function GuruDashboard() {
  const { user } = useAuth();
  const [totalSiswa, setTotalSiswa] = useState(null);

  useEffect(() => {
    api
      .get("/siswa")
      .then((res) => setTotalSiswa(res.data.data.length))
      .catch(() => setTotalSiswa(null));
  }, []);

  const shortcuts = [
    { to: "/guru/absensi", label: "Input Absensi", icon: ClipboardCheck },
    { to: "/guru/kegiatan-harian", label: "Input Kegiatan Harian", icon: BookOpen },
    { to: "/guru/rapor", label: "Input Rapor", icon: FileText },
    { to: "/guru/siswa", label: "Lihat Data Siswa", icon: Users },
  ];

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
        Halo, {user?.nama || user?.username} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Ini ringkasan aktivitas kelas kamu hari ini.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Total Siswa</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {totalSiswa ?? "…"}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-slate-700">
        Menu cepat
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#3C8A7D]/40 hover:bg-[#3C8A7D]/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16302C]/5 text-[#16302C]">
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}