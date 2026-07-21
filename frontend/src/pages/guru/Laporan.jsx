// src/pages/guru/Laporan.jsx
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  CalendarRange,
  Printer,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";
import api from "../../services/api";
import { useKelasList } from "../../hooks/useKelasList";

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

const STATUS_LABEL = {
  HADIR: { label: "Hadir", color: "text-emerald-600 bg-emerald-50" },
  IZIN: { label: "Izin", color: "text-amber-600 bg-amber-50" },
  SAKIT: { label: "Sakit", color: "text-sky-600 bg-sky-50" },
  ALPA: { label: "Alpa", color: "text-rose-600 bg-rose-50" },
};

export default function Laporan() {
  const { kelasList } = useKelasList();

  const [kelasId, setKelasId] = useState("");
  const [dari, setDari] = useState(firstDayOfMonth());
  const [sampai, setSampai] = useState(today());

  const [absensi, setAbsensi] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!kelasId) {
      setAbsensi([]);
      setKegiatan([]);
      return;
    }
    setLoading(true);
    setError("");

    Promise.all([
      api.get("/absensi", { params: { kelasId, dari, sampai } }),
      api.get("/kegiatan-harian", { params: { kelasId, dari, sampai } }),
    ])
      .then(([absensiRes, kegiatanRes]) => {
        setAbsensi(absensiRes.data.data || []);
        setKegiatan(kegiatanRes.data.data || []);
      })
      .catch(() => setError("Gagal memuat data laporan."))
      .finally(() => setLoading(false));
  }, [kelasId, dari, sampai]);

  const rekap = useMemo(() => {
    const base = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
    absensi.forEach((a) => {
      if (base[a.status] !== undefined) base[a.status] += 1;
    });
    return base;
  }, [absensi]);

  const totalCatatan = absensi.length;
  const tingkatHadir =
    totalCatatan > 0 ? Math.round((rekap.HADIR / totalCatatan) * 100) : 0;

  const namaKelas = kelasList.find((k) => String(k.id) === String(kelasId))?.nama;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Laporan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Rekap kehadiran dan kegiatan kelas dalam periode tertentu.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          disabled={!kelasId}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Printer size={16} /> Cetak
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users size={12} /> Kelas
          </label>
          <select
            value={kelasId}
            onChange={(e) => setKelasId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          >
            <option value="">Pilih kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>
                Kelas {k.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CalendarRange size={12} /> Dari tanggal
          </label>
          <input
            type="date"
            value={dari}
            onChange={(e) => setDari(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CalendarRange size={12} /> Sampai tanggal
          </label>
          <input
            type="date"
            value={sampai}
            onChange={(e) => setSampai(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm font-medium text-[#C4432F]">
          {error}
        </div>
      )}

      {!kelasId ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BarChart3 size={26} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            Pilih kelas untuk melihat laporan.
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <>
          {/* Rekap kehadiran */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ClipboardCheck size={15} className="text-slate-400" />
              Rekap Kehadiran — Kelas {namaKelas}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#3C8A7D]">{tingkatHadir}%</p>
                <p className="mt-1 text-xs text-slate-500">Tingkat Hadir</p>
              </div>
              {Object.entries(STATUS_LABEL).map(([key, s]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-bold text-slate-900">
                    {rekap[key]}
                  </p>
                  <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat kegiatan dalam periode */}
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BookOpen size={15} className="text-slate-400" />
              Kegiatan Harian dalam Periode Ini
            </h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {kegiatan.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">
                  Belum ada kegiatan yang tercatat dalam periode ini.
                </p>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {kegiatan.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="w-24 shrink-0 text-xs text-slate-400">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {item.tema || "(Tanpa tema)"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}