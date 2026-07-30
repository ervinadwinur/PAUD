// src/pages/guru/Absensi.jsx
import { useState } from "react";
import {
  Calendar,
  Check,
  X,
  Stethoscope,
  FileText,
  Save,
  Users,
} from "lucide-react";

const statusOptions = [
  { value: "Hadir", icon: Check, color: "emerald" },
  { value: "Izin", icon: FileText, color: "amber" },
  { value: "Sakit", icon: Stethoscope, color: "sky" },
  { value: "Alpa", icon: X, color: "rose" },
];

const colorClasses = {
  emerald: {
    active: "bg-emerald-500 text-white border-emerald-500",
    idle: "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600",
  },
  amber: {
    active: "bg-amber-500 text-white border-amber-500",
    idle: "border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600",
  },
  sky: {
    active: "bg-sky-500 text-white border-sky-500",
    idle: "border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600",
  },
  rose: {
    active: "bg-rose-500 text-white border-rose-500",
    idle: "border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600",
  },
};

const siswaKelas = [
  { id: 1, nama: " Bu Siti" },
  { id: 2, nama: "Bu Bunga Anggraini" },
  { id: 3, nama: "Bu Citra Maharani" },
  { id: 4, nama: "Bapak Dimas Prakoso" },
  { id: 5, nama: "Bu Eka Putri" },
  { id: 6, nama: "Bapak Farhan Ramadhan" },
];

const namaKelas = "";

export default function Absensi() {
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [absensi, setAbsensi] = useState(() =>
    Object.fromEntries(siswaKelas.map((s) => [s.id, "Hadir"])),
  );
  const [catatan, setCatatan] = useState({});
  const [saved, setSaved] = useState(false);

  function setStatus(id, status) {
    setAbsensi((prev) => ({ ...prev, [id]: status }));
    setSaved(false);
  }

  function setAllHadir() {
    setAbsensi(Object.fromEntries(siswaKelas.map((s) => [s.id, "Hadir"])));
    setSaved(false);
  }

  function handleSave() {
    // TODO: kirim { tanggal, kelas: namaKelas, absensi, catatan } ke API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const summary = statusOptions.map((opt) => ({
    ...opt,
    count: Object.values(absensi).filter((v) => v === opt.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Absensi Guru {namaKelas}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tandai kehadiran guru untuk hari ini.
          </p>
        </div>
        <label className="relative">
          <Calendar
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </label>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.value}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${colorClasses[s.color].active}`}
              >
                <Icon size={16} />
              </span>
              <div>
                <p className="text-lg font-bold text-slate-900">{s.count}</p>
                <p className="text-xs text-slate-500">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daftar siswa */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users size={16} className="text-slate-400" />
            {siswaKelas.length} guru
          </span>
          <button
            onClick={setAllHadir}
            className="text-xs font-medium text-[#3C8A7D] hover:underline"
          >
            Tandai semua hadir
          </button>
        </div>

        <ul className="divide-y divide-slate-50">
          {siswaKelas.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                  {s.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <span className="font-medium text-slate-800">{s.nama}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = absensi[s.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(s.id, opt.value)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? colorClasses[opt.color].active
                          : colorClasses[opt.color].idle
                      }`}
                    >
                      <Icon size={13} />
                      {opt.value}
                    </button>
                  );
                })}

                {(absensi[s.id] === "Izin" || absensi[s.id] === "Sakit") && (
                  <input
                    type="text"
                    value={catatan[s.id] || ""}
                    onChange={(e) =>
                      setCatatan((prev) => ({ ...prev, [s.id]: e.target.value }))
                    }
                    placeholder="Keterangan (opsional)"
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3C8A7D]/40 focus:ring-2 focus:ring-[#3C8A7D]/10 sm:w-40"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Simpan */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Absensi tersimpan ✓
          </span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#3C8A7D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"
        >
          <Save size={16} /> Simpan Absensi
        </button>
      </div>
    </div>
  );
}