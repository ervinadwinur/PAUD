import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  GraduationCap,
  Calendar,
  ChevronDown,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API:
// GET /api/orangtua/anak              -> daftar anak
// GET /api/rapor?siswaId=             -> daftar rapor per semester/tahun ajaran

const DUMMY_ANAK = [
  { id: 1, nama: "Ahmad Fauzi", kelas: "Kelompok A" },
  { id: 2, nama: "Kirana Ahmad", kelas: "Kelompok B" },
];

const DUMMY_RAPOR = {
  1: [
    {
      id: 1,
      semester: "Ganjil",
      tahunAjaran: "2025/2026",
      catatan:
        "Ahmad menunjukkan perkembangan yang baik dalam aspek motorik dan sosial. Perlu peningkatan pada kemampuan berbahasa.",
      fileUrl: "/dummy/rapor_ahmad_ganjil_2025.pdf",
      guru: "Siti Aminah",
      diperbaruiPada: "2026-01-10",
    },
    {
      id: 2,
      semester: "Genap",
      tahunAjaran: "2024/2025",
      catatan:
        "Perkembangan kognitif Ahmad sangat baik, mampu mengenali angka dan bentuk dengan cepat.",
      fileUrl: "/dummy/rapor_ahmad_genap_2024.pdf",
      guru: "Siti Aminah",
      diperbaruiPada: "2025-06-15",
    },
  ],
  2: [
    {
      id: 3,
      semester: "Ganjil",
      tahunAjaran: "2025/2026",
      catatan: "Kirana aktif berkomunikasi dan percaya diri tampil di depan kelas.",
      fileUrl: "/dummy/rapor_kirana_ganjil_2025.pdf",
      guru: "Budi Santoso",
      diperbaruiPada: "2026-01-12",
    },
  ],
};

function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Raport = () => {
  const [selectedAnak, setSelectedAnak] = useState(DUMMY_ANAK[0]?.id ?? null);
  const [expandedId, setExpandedId] = useState(null);

  const daftarRapor = useMemo(() => {
    return (DUMMY_RAPOR[selectedAnak] || []).slice().sort((a, b) => {
      if (a.tahunAjaran !== b.tahunAjaran) return b.tahunAjaran.localeCompare(a.tahunAjaran);
      return a.semester === "Genap" ? -1 : 1;
    });
  }, [selectedAnak]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDownload = (rapor) => {
    // Ganti dengan logika unduh sesungguhnya, misal window.open(rapor.fileUrl, "_blank")
    window.open(rapor.fileUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Rapor Anak</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lihat dan unduh rapor perkembangan anak Anda tiap semester.
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

      {/* Daftar rapor */}
      {daftarRapor.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
          Belum ada rapor yang tersedia untuk anak ini.
        </div>
      ) : (
        <div className="space-y-3">
          {daftarRapor.map((r) => {
            const isOpen = expandedId === r.id;
            return (
              <div
                key={r.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleExpand(r.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Semester {r.semester} — {r.tahunAjaran}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <GraduationCap size={13} />
                        Wali kelas: {r.guru}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-600">{r.catatan}</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={13} />
                        Diperbarui {formatTanggal(r.diperbaruiPada)}
                      </span>
                      <button
                        onClick={() => handleDownload(r)}
                        disabled={!r.fileUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      >
                        <Download size={16} />
                        Unduh Rapor (PDF)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Raport;