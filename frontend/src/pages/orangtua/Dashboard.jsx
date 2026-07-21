// src/pages/orangtua/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Baby,
  ClipboardCheck,
  BookOpen,
  FileText,
  Wallet,
  ArrowUpRight,
  Sprout,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const shortcuts = [
  {
    to: "/orangtua/absensi",
    label: "Absensi",
    desc: "Lihat kehadiran anak",
    icon: ClipboardCheck,
    color: "#3C8A7D",
  },
  {
    to: "/orangtua/kegiatan",
    label: "Kegiatan Harian",
    desc: "Aktivitas belajar hari ini",
    icon: BookOpen,
    color: "#5B8DEF",
  },
  {
    to: "/orangtua/raport",
    label: "Raport",
    desc: "Perkembangan anak",
    icon: FileText,
    color: "#F5A623",
  },
  {
    to: "/orangtua/pembayaran",
    label: "Pembayaran SPP",
    desc: "Status & bukti bayar",
    icon: Wallet,
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

export default function OrangtuaDashboard() {
  const { user } = useAuth();
  const [anakList, setAnakList] = useState([]);
  const [loadingAnak, setLoadingAnak] = useState(true);

  useEffect(() => {
    api
      .get("/anak")
      .then((res) => setAnakList(res.data.data || []))
      .catch(() => setAnakList([]))
      .finally(() => setLoadingAnak(false));
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const namaTampil = user?.nama || user?.username || "Bapak/Ibu";
  const firstName = namaTampil.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
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
              Pantau perkembangan, kehadiran, dan rapor si kecil di sini.
            </p>
          </div>

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

      {/* Kartu anak */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Anak Saya
        </h2>

        {loadingAnak ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : anakList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Baby size={26} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Belum ada data anak yang terhubung ke akun ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {anakList.map((anak) => (
              <div
                key={anak.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-sm font-bold text-white">
                  {anak.nama
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {anak.nama}
                  </p>
                  <p className="text-xs text-slate-500">
                    NIS {anak.nis} · Kelas {anak.kelas?.nama ?? "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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