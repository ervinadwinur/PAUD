import { useState, useMemo } from "react";
import {
  Wallet,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Calendar,
  Banknote,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API:
// GET /api/orangtua/anak                 -> daftar anak
// GET /api/pembayaran?siswaId=&tahun=     -> riwayat pembayaran SPP per tahun
// POST /api/pembayaran/:id/upload-bukti   -> upload bukti transfer (multipart/form-data)

const DUMMY_ANAK = [
  { id: 1, nama: "Ahmad Fauzi", kelas: "Kelompok A" },
  { id: 2, nama: "Kirana Ahmad", kelas: "Kelompok B" },
];

const BULAN_NAMA = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const STATUS_CONFIG = {
  BELUM_BAYAR: {
    label: "Belum Bayar",
    icon: AlertCircle,
    text: "text-slate-600",
    bg: "bg-slate-100",
  },
  MENUNGGU_VERIFIKASI: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  LUNAS: {
    label: "Lunas",
    icon: CheckCircle2,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  DITOLAK: {
    label: "Ditolak",
    icon: XCircle,
    text: "text-red-700",
    bg: "bg-red-50",
  },
};

const JUMLAH_SPP = 350000;

// Dummy riwayat pembayaran tahun 2026 untuk masing-masing anak
const DUMMY_PEMBAYARAN = {
  1: Array.from({ length: 7 }, (_, i) => {
    const bulan = i + 1;
    let status = "BELUM_BAYAR";
    let catatan = null;
    if (bulan <= 5) status = "LUNAS";
    if (bulan === 6) status = "MENUNGGU_VERIFIKASI";
    if (bulan === 7) {
      status = "DITOLAK";
      catatan = "Nominal transfer tidak sesuai, mohon unggah ulang bukti pembayaran.";
    }
    return {
      id: bulan,
      bulan,
      tahun: 2026,
      jumlah: JUMLAH_SPP,
      status,
      catatan,
      buktiUrl: status === "LUNAS" || status === "MENUNGGU_VERIFIKASI" ? "/dummy/bukti.jpg" : null,
    };
  }),
  2: Array.from({ length: 7 }, (_, i) => {
    const bulan = i + 1;
    return {
      id: 100 + bulan,
      bulan,
      tahun: 2026,
      jumlah: JUMLAH_SPP,
      status: bulan <= 6 ? "LUNAS" : "BELUM_BAYAR",
      catatan: null,
      buktiUrl: bulan <= 6 ? "/dummy/bukti.jpg" : null,
    };
  }),
};

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
}

const Pembayaran = () => {
  const [selectedAnak, setSelectedAnak] = useState(DUMMY_ANAK[0]?.id ?? null);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const riwayat = useMemo(
    () => (DUMMY_PEMBAYARAN[selectedAnak] || []).slice().sort((a, b) => b.bulan - a.bulan),
    [selectedAnak]
  );

  const summary = useMemo(() => {
    const lunas = riwayat.filter((r) => r.status === "LUNAS").length;
    const belumBayar = riwayat.filter((r) => r.status === "BELUM_BAYAR" || r.status === "DITOLAK").length;
    const totalTagihan = riwayat.reduce((sum, r) => sum + r.jumlah, 0);
    const totalLunas = riwayat.filter((r) => r.status === "LUNAS").reduce((s, r) => s + r.jumlah, 0);
    return { lunas, belumBayar, totalTagihan, totalLunas };
  }, [riwayat]);

  const openUpload = (item) => {
    setUploadTarget(item);
    setUploadFile(null);
  };

  const closeUpload = () => {
    setUploadTarget(null);
    setUploadFile(null);
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    // TODO: kirim ke backend -> POST /api/pembayaran/:id/upload-bukti (FormData)
    closeUpload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Pembayaran SPP</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau status dan riwayat pembayaran SPP bulanan anak Anda.
        </p>
      </div>

      {/* Selector anak */}
      {DUMMY_ANAK.length > 1 && (
        <div className="flex gap-2">
          {DUMMY_ANAK.map((anak) => (
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Bulan Lunas
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{summary.lunas} bulan</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <AlertCircle size={16} className="text-red-400" />
            Belum Dibayar
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{summary.belumBayar} bulan</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Banknote size={16} className="text-slate-400" />
            Total Sudah Dibayar
          </div>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">
            {formatRupiah(summary.totalLunas)}
          </p>
        </div>
      </div>

      {/* Riwayat pembayaran */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Riwayat Bulanan — 2026</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {riwayat.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            const Icon = cfg.icon;
            const bisaUpload = item.status === "BELUM_BAYAR" || item.status === "DITOLAK";
            return (
              <li key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {BULAN_NAMA[item.bulan - 1]} {item.tahun}
                    </p>
                    <p className="text-xs text-slate-400">{formatRupiah(item.jumlah)}</p>
                    {item.catatan && (
                      <p className="mt-0.5 text-xs text-red-500">{item.catatan}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-md ${cfg.bg} px-2.5 py-1 text-xs font-medium ${cfg.text}`}>
                    <Icon size={13} />
                    {cfg.label}
                  </span>
                  {bisaUpload && (
                    <button
                      onClick={() => openUpload(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
                    >
                      <Upload size={14} />
                      Unggah Bukti
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal upload bukti */}
      {uploadTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2 text-slate-700">
                <Wallet size={18} className="text-emerald-600" />
                <h2 className="text-base font-semibold">
                  Bayar SPP {BULAN_NAMA[uploadTarget.bulan - 1]} {uploadTarget.tahun}
                </h2>
              </div>
              <button
                onClick={closeUpload}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4 px-6 py-5">
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Jumlah tagihan:{" "}
                <span className="font-semibold text-slate-800">
                  {formatRupiah(uploadTarget.jumlah)}
                </span>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Bukti Transfer
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600">
                  <Upload size={18} />
                  {uploadFile ? uploadFile.name : "Klik untuk unggah foto/scan bukti transfer"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUpload}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Kirim Bukti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pembayaran;