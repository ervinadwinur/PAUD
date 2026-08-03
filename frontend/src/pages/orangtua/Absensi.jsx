import { useState, useMemo, useEffect } from "react";
import siswaService from "../../services/siswaService";
import absensiService from "../../services/absensiService";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Stethoscope,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API:
// GET /api/orangtua/anak            -> daftar anak milik orang tua yang login
// GET /api/absensi?siswaId=&bulan=&tahun= -> riwayat absensi anak terpilih

const DUMMY_ANAK = [
  { id: 1, nama: "Ahmad Fauzi", kelas: "Kelompok A" },
  { id: 2, nama: "Kirana Ahmad", kelas: "Kelompok B" },
];

const STATUS_CONFIG = {
  HADIR: {
    label: "Hadir",
    icon: CheckCircle2,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  IZIN: {
    label: "Izin",
    icon: FileText,
    text: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  SAKIT: {
    label: "Sakit",
    icon: Stethoscope,
    text: "text-sky-700",
    bg: "bg-sky-50",
    dot: "bg-sky-500",
  },
  ALPA: {
    label: "Alpa",
    icon: XCircle,
    text: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
};

const BULAN_NAMA = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Dummy absensi Juli 2026 untuk anak id 1
const DUMMY_ABSENSI = {
  1: [
    { id: 1, tanggal: "2026-07-01", status: "HADIR", keterangan: "" },
    { id: 2, tanggal: "2026-07-02", status: "HADIR", keterangan: "" },
    { id: 3, tanggal: "2026-07-03", status: "SAKIT", keterangan: "Demam ringan" },
    { id: 4, tanggal: "2026-07-06", status: "HADIR", keterangan: "" },
    { id: 5, tanggal: "2026-07-07", status: "HADIR", keterangan: "" },
    { id: 6, tanggal: "2026-07-08", status: "IZIN", keterangan: "Acara keluarga" },
    { id: 7, tanggal: "2026-07-09", status: "HADIR", keterangan: "" },
    { id: 8, tanggal: "2026-07-10", status: "HADIR", keterangan: "" },
    { id: 9, tanggal: "2026-07-13", status: "ALPA", keterangan: "" },
    { id: 10, tanggal: "2026-07-14", status: "HADIR", keterangan: "" },
  ],
  2: [
    { id: 11, tanggal: "2026-07-01", status: "HADIR", keterangan: "" },
    { id: 12, tanggal: "2026-07-02", status: "IZIN", keterangan: "Kontrol dokter gigi" },
    { id: 13, tanggal: "2026-07-03", status: "HADIR", keterangan: "" },
    { id: 14, tanggal: "2026-07-06", status: "HADIR", keterangan: "" },
    { id: 15, tanggal: "2026-07-07", status: "HADIR", keterangan: "" },
  ],
};

function formatTanggalPanjang(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Absensi = () => {
  const [anakList, setAnakList] = useState([]);
  const [selectedAnak, setSelectedAnak] = useState(null);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [periode, setPeriode] = useState({ bulan: new Date().getMonth(), tahun: new Date().getFullYear() });

useEffect(() => {
  siswaService.getAll().then((res) => {
    const anak = res.data.data || [];
    setAnakList(anak);
    setSelectedAnak(anak[0]?.id || null);
  });
}, []);

useEffect(() => {
  if (selectedAnak) {
    absensiService.getAll({ siswaId: selectedAnak }).then((res) => setDataAbsensi(res.data.data || []));
  }
}, [selectedAnak]);

  const riwayat = useMemo(() => {
    const data = dataAbsensi;
    return data
      .filter((a) => {
        const d = new Date(a.tanggal);
        return d.getMonth() === periode.bulan && d.getFullYear() === periode.tahun;
      })
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [dataAbsensi, periode]);

  const rekap = useMemo(() => {
    const base = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
    riwayat.forEach((a) => {
      base[a.status] = (base[a.status] || 0) + 1;
    });
    return base;
  }, [riwayat]);

  const totalHari = riwayat.length;
  const persenHadir = totalHari > 0 ? Math.round((rekap.HADIR / totalHari) * 100) : 0;

  const gantiBulan = (arah) => {
    setPeriode((prev) => {
      let bulan = prev.bulan + arah;
      let tahun = prev.tahun;
      if (bulan < 0) {
        bulan = 11;
        tahun -= 1;
      } else if (bulan > 11) {
        bulan = 0;
        tahun += 1;
      }
      return { bulan, tahun };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Absensi Anak</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau riwayat kehadiran anak Anda di sekolah.
        </p>
      </div>

      {/* Filter: anak + bulan */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {anakList.length > 1 && (
          <div className="flex gap-2">
            {anakList.map((anak) => (
              <button
                key={anak.id}
                onClick={() => setSelectedAnak(anak.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  selectedAnak === anak.id
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {anak.nama}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
          <button
            onClick={() => gantiBulan(-1)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="flex items-center gap-1.5 px-2 text-sm font-medium text-slate-700">
            <CalendarDays size={16} className="text-slate-400" />
            {BULAN_NAMA[periode.bulan]} {periode.tahun}
          </span>
          <button
            onClick={() => gantiBulan(1)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Rekap stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className={`inline-flex items-center gap-1.5 rounded-md ${cfg.bg} px-2 py-1 text-xs font-medium ${cfg.text}`}>
                <Icon size={14} />
                {cfg.label}
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{rekap[key] || 0}</p>
              <p className="text-xs text-slate-400">hari</p>
            </div>
          );
        })}
      </div>

      {/* Persentase kehadiran */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Persentase Kehadiran</span>
          <span className="font-semibold text-emerald-600">{persenHadir}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${persenHadir}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Berdasarkan {totalHari} hari tercatat pada {BULAN_NAMA[periode.bulan]} {periode.tahun}.
        </p>
      </div>

      {/* Riwayat list */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Riwayat Harian</h2>
        </div>

        {riwayat.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            Belum ada data absensi untuk periode ini.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {riwayat.map((a) => {
              const cfg = STATUS_CONFIG[a.status];
              const Icon = cfg.icon;
              return (
                <li key={a.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {formatTanggalPanjang(a.tanggal)}
                      </p>
                      {a.keterangan && (
                        <p className="text-xs text-slate-400">{a.keterangan}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md ${cfg.bg} px-2.5 py-1 text-xs font-medium ${cfg.text}`}
                  >
                    <Icon size={13} />
                    {cfg.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Absensi;
