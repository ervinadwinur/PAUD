// src/pages/admin/Dashboard.jsx
import {
  Users,
  GraduationCap,
  School,
  Wallet,
  TrendingUp,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Siswa",
    value: "128",
    change: "+4 bulan ini",
    trend: "up",
    icon: Users,
    color: "bg-[#3C8A7D]",
  },
  {
    label: "Total Guru",
    value: "14",
    change: "+1 bulan ini",
    trend: "up",
    icon: GraduationCap,
    color: "bg-[#5B8DEF]",
  },
  {
    label: "Total Kelas",
    value: "6",
    change: "Tetap",
    trend: "flat",
    icon: School,
    color: "bg-[#F5A623]",
  },
  {
    label: "SPP Belum Dibayar",
    value: "23",
    change: "-5 dari bulan lalu",
    trend: "down",
    icon: Wallet,
    color: "bg-[#FF6F59]",
  },
];

const recentActivity = [
  {
    title: "Pembayaran SPP baru",
    desc: "Ibu Rina membayar SPP Kelas Kelinci",
    time: "5 menit lalu",
  },
  {
    title: "Absensi belum diisi",
    desc: "Kelas Kupu-kupu belum absen hari ini",
    time: "1 jam lalu",
  },
  {
    title: "Data siswa baru ditambahkan",
    desc: "Ahmad Fauzi terdaftar di Kelas Kelinci",
    time: "3 jam lalu",
  },
  {
    title: "Pengumuman baru",
    desc: "Libur semester genap diperbarui",
    time: "Kemarin",
  },
];

const attendanceToday = [
  { kelas: "Kelinci", hadir: 18, total: 20 },
  { kelas: "Kupu-kupu", hadir: 15, total: 19 },
  { kelas: "Lebah", hadir: 12, total: 16 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard Admin
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Selamat datang kembali, berikut ringkasan hari ini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}
                >
                  <Icon size={20} className="text-white" />
                </span>
                {s.trend !== "flat" && (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-semibold ${
                      s.trend === "up" ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {s.trend === "up" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">
                {s.value}
              </p>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-2 text-xs text-slate-400">{s.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Absensi hari ini */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Absensi Hari Ini
            </h2>
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#3C8A7D]">
              <ClipboardCheck size={14} /> Lihat semua
            </span>
          </div>
          <div className="space-y-4">
            {attendanceToday.map((a) => {
              const pct = Math.round((a.hadir / a.total) * 100);
              return (
                <div key={a.kelas}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Kelas {a.kelas}
                    </span>
                    <span className="text-slate-500">
                      {a.hadir}/{a.total} hadir
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#3C8A7D] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aktivitas terbaru */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">
              Aktivitas Terbaru
            </h2>
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <ul className="space-y-4">
            {recentActivity.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3C8A7D]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {a.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{a.desc}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}