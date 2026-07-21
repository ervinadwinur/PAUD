// src/pages/guru/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  ArrowUpRight,
  Sprout,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const shortcuts = [
  {
    to: "/guru/absensi",
    label: "Input Absensi",
    desc: "Catat kehadiran siswa",
    icon: ClipboardCheck,
    color: "#3C8A7D",
  },
  {
    to: "/guru/kegiatan-harian",
    label: "Kegiatan Harian",
    desc: "Tulis aktivitas belajar",
    icon: BookOpen,
    color: "#5B8DEF",
  },
  {
    to: "/guru/rapor",
    label: "Input Rapor",
    desc: "Isi penilaian anak",
    icon: FileText,
    color: "#F5A623",
  },
  {
    to: "/guru/siswa",
    label: "Data Siswa",
    desc: "Lihat daftar kelasmu",
    icon: Users,
    color: "#B26FD1",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function GuruDashboard() {
  const { user } = useAuth();
  const [totalSiswa, setTotalSiswa] = useState(null);
  const [loadingSiswa, setLoadingSiswa] = useState(true);

  useEffect(() => {
    api
      .get("/siswa")
      .then((res) => setTotalSiswa(res.data.data.length))
      .catch(() => setTotalSiswa(null))
      .finally(() => setLoadingSiswa(false));
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const namaTampil = user?.nama || user?.username || "Guru";
  const firstName = namaTampil.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Hero banner — signature "tahapan tumbuh" */}
      <div className="relative overflow-hidden rounded-3xl bg-[#16302C] px-6 py-8 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#3C8A7D]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#FF6F59]/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-[#8FB0A8]">
              {getGreeting()} · {today}
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Halo, {firstName}
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-[#B9C7C1]">
              Ini ringkasan kelasmu hari ini — tetap semangat menemani si
              kecil bertumbuh.
            </p>
          </div>

          {/* Motif tahapan tumbuh, konsisten dengan halaman login */}
          <div className="hidden items-end gap-2.5 sm:flex">
            {[
              { h: "h-7", w: "w-9" },
              { h: "h-10", w: "w-9" },
              { h: "h-14", w: "w-9" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex ${s.h} ${s.w} flex-col items-center justify-end rounded-t-full rounded-b-lg bg-gradient-to-t from-[#3C8A7D] to-[#5BAE9F]`}
              >
                <Sprout size={12} className="mb-1.5 text-white/90" strokeWidth={2.5} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C8A7D]/10">
            <Users size={18} className="text-[#3C8A7D]" />
          </span>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {loadingSiswa ? (
              <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-100 align-middle" />
            ) : (
              (totalSiswa ?? "—")
            )}
          </p>
          <p className="text-sm text-slate-500">Total Siswa</p>
        </div>

        <StatusCard
          icon={ClipboardCheck}
          label="Absensi hari ini"
          done={false}
          to="/guru/absensi"
        />
        <StatusCard
          icon={BookOpen}
          label="Kegiatan hari ini"
          done={false}
          to="/guru/kegiatan-harian"
        />
      </div>

      {/* Menu cepat */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Menu cepat
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                style={{ backgroundColor: color }}
              />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}17` }}
              >
                <Icon size={18} style={{ color }} />
              </span>
              <p className="mt-3.5 text-sm font-semibold text-slate-800">
                {label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
              <ArrowUpRight
                size={15}
                className="absolute right-4 top-4 text-slate-300 transition group-hover:text-slate-400"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, done, to }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
        done
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            done ? "bg-emerald-500/10" : "bg-[#F5A623]/10"
          }`}
        >
          <Icon
            size={18}
            className={done ? "text-emerald-600" : "text-[#F5A623]"}
          />
        </span>
        <p className="mt-4 text-sm font-semibold text-slate-800">{label}</p>
        <p
          className={`mt-0.5 text-xs font-medium ${
            done ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {done ? "Sudah diisi" : "Belum diisi — isi sekarang"}
        </p>
      </div>
    </Link>
  );
}