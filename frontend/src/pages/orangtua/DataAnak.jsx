import { useEffect, useState } from "react";
import siswaService from "../../services/siswaService";
import {
  User,
  Calendar,
  MapPin,
  GraduationCap,
  BadgeCheck,
  X,
  Phone,
  Cake,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API (GET /api/orangtua/anak) — hasil filter berdasarkan orangTuaId yang login

const DUMMY_ANAK = [
  {
    id: 1,
    nis: "2025010001",
    nama: "Ahmad Fauzi",
    tanggalLahir: "2021-03-14",
    jenisKelamin: "LAKI_LAKI",
    alamat: "Jl. Melati No. 12, Bekasi",
    fotoUrl: null,
    kelas: {
      nama: "Kelompok A",
      tahunAjaran: "2025/2026",
      guru: { nama: "Siti Aminah", noTelepon: "081234567001" },
    },
  },
  {
    id: 2,
    nis: "2025010045",
    nama: "Kirana Ahmad",
    tanggalLahir: "2022-08-02",
    jenisKelamin: "PEREMPUAN",
    alamat: "Jl. Melati No. 12, Bekasi",
    fotoUrl: null,
    kelas: {
      nama: "Kelompok B",
      tahunAjaran: "2025/2026",
      guru: { nama: "Budi Santoso", noTelepon: "081234567002" },
    },
  },
];

function hitungUsia(tanggalLahir) {
  const lahir = new Date(tanggalLahir);
  const now = new Date();
  let tahun = now.getFullYear() - lahir.getFullYear();
  let bulan = now.getMonth() - lahir.getMonth();
  if (bulan < 0 || (bulan === 0 && now.getDate() < lahir.getDate())) {
    tahun -= 1;
    bulan += 12;
  }
  if (now.getDate() < lahir.getDate()) bulan -= 1;
  if (bulan < 0) bulan += 12;
  return `${tahun} th ${bulan} bln`;
}

function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const DataAnak = () => {
  const [selected, setSelected] = useState(null);
  const [anakList, setAnakList] = useState([]);
  const [pesan, setPesan] = useState("");

useEffect(() => {
  siswaService
    .getAll()
    .then((res) => {
      console.log("DEBUG siswa res:", res);
      setAnakList(res.data.data || []);
    })
    .catch((err) => {
      console.error("DEBUG siswa error:", err);
      setPesan(err.response?.data?.message || "Data anak gagal dimuat.");
    });
}, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Data Anak</h1>
        <p className="mt-1 text-sm text-slate-500">
          Informasi profil dan kelas anak Anda yang terdaftar di sekolah.
        </p>
      </div>

      {/* Grid kartu anak */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {anakList.map((anak) => (
          <div
            key={anak.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4 border-b border-slate-100 p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-600">
                {anak.fotoUrl ? (
                  <img
                    src={anak.fotoUrl}
                    alt={anak.nama}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={28} />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-800">
                  {anak.nama}
                </p>
                <p className="text-sm text-slate-500">NIS: {anak.nis}</p>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    anak.jenisKelamin === "LAKI_LAKI"
                      ? "bg-sky-50 text-sky-700"
                      : "bg-pink-50 text-pink-700"
                  }`}
                >
                  {anak.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 p-5 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap size={16} className="text-slate-400" />
                {anak.kelas?.nama || "Belum ada kelas"} — {anak.kelas?.tahunAjaran || "—"}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Cake size={16} className="text-slate-400" />
                {hitungUsia(anak.tanggalLahir)}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <BadgeCheck size={16} className="text-slate-400" />
                Wali kelas: {anak.kelas?.guru?.nama || "—"}
              </div>
            </div>

            <div className="border-t border-slate-100 p-4">
              <button
                onClick={() => setSelected(anak)}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {pesan && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{pesan}</div>}
      {anakList.length === 0 && !pesan && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
          Belum ada data anak yang terhubung dengan akun Anda. Hubungi admin sekolah jika ini
          tidak sesuai.
        </div>
      )}

      {/* Modal detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">Detail Anak</h2>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-600">
                  {selected.fotoUrl ? (
                    <img
                      src={selected.fotoUrl}
                      alt={selected.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={28} />
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800">{selected.nama}</p>
                  <p className="text-sm text-slate-500">NIS: {selected.nis}</p>
                </div>
              </div>

              <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                <div className="flex items-start gap-3 px-4 py-3">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-xs text-slate-400">Tanggal Lahir</dt>
                    <dd className="text-sm text-slate-700">
                      {formatTanggal(selected.tanggalLahir)} ({hitungUsia(selected.tanggalLahir)})
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-xs text-slate-400">Alamat</dt>
                    <dd className="text-sm text-slate-700">{selected.alamat}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <GraduationCap size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-xs text-slate-400">Kelas</dt>
                    <dd className="text-sm text-slate-700">
                      {selected.kelas?.nama || "—"} — Tahun Ajaran {selected.kelas?.tahunAjaran || "—"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <BadgeCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-xs text-slate-400">Wali Kelas</dt>
                    <dd className="text-sm text-slate-700">{selected.kelas?.guru?.nama || "—"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-xs text-slate-400">Kontak Wali Kelas</dt>
                    <dd className="text-sm text-slate-700">
                      {selected.kelas?.guru?.noTelepon || "—"}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnak;
