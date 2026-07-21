import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Brain,
  MessageCircle,
  Users,
  Dumbbell,
  Calendar,
  X,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API:
// GET /api/orangtua/anak                          -> daftar anak
// GET /api/kegiatan-harian?siswaId=&bulan=&tahun=  -> aktivitas harian
// GET /api/perkembangan?siswaId=                   -> catatan perkembangan per aspek

const DUMMY_ANAK = [
  { id: 1, nama: "Ahmad Fauzi", kelas: "Kelompok A" },
  { id: 2, nama: "Kirana Ahmad", kelas: "Kelompok B" },
];

const ASPEK_CONFIG = {
  motorik: { label: "Motorik", icon: Dumbbell, text: "text-orange-700", bg: "bg-orange-50" },
  kognitif: { label: "Kognitif", icon: Brain, text: "text-violet-700", bg: "bg-violet-50" },
  bahasa: { label: "Bahasa", icon: MessageCircle, text: "text-sky-700", bg: "bg-sky-50" },
  "sosial-emosional": {
    label: "Sosial-Emosional",
    icon: Users,
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

const DUMMY_KEGIATAN = {
  1: [
    {
      id: 1,
      tanggal: "2026-07-14",
      judul: "Bermain Puzzle Bentuk",
      deskripsi:
        "Ahmad antusias menyusun puzzle bentuk geometri bersama teman-teman. Mampu menyelesaikan 8 dari 10 keping tanpa bantuan.",
      fotoUrl: null,
    },
    {
      id: 2,
      tanggal: "2026-07-13",
      judul: "Menyanyi & Gerak Lagu",
      deskripsi: "Mengikuti kegiatan menyanyi 'Balonku' dengan gerakan tangan yang sesuai irama.",
      fotoUrl: null,
    },
    {
      id: 3,
      tanggal: "2026-07-10",
      judul: "Mewarnai Gambar Hewan",
      deskripsi: "Mewarnai gambar kucing dengan rapi, memilih kombinasi warna yang menarik.",
      fotoUrl: null,
    },
  ],
  2: [
    {
      id: 4,
      tanggal: "2026-07-14",
      judul: "Bercerita di Depan Kelas",
      deskripsi: "Kirana berani bercerita pengalaman liburannya di depan teman sekelas.",
      fotoUrl: null,
    },
  ],
};

const DUMMY_PERKEMBANGAN = {
  1: [
    {
      id: 1,
      aspek: "motorik",
      deskripsi: "Mampu melompat dengan satu kaki secara seimbang dan menangkap bola kecil.",
      tanggal: "2026-07-08",
    },
    {
      id: 2,
      aspek: "kognitif",
      deskripsi: "Sudah bisa mengurutkan angka 1-10 dan mengenali pola sederhana.",
      tanggal: "2026-07-05",
    },
    {
      id: 3,
      aspek: "bahasa",
      deskripsi: "Kosakata bertambah, mulai menyusun kalimat 4-5 kata dengan struktur baik.",
      tanggal: "2026-06-28",
    },
    {
      id: 4,
      aspek: "sosial-emosional",
      deskripsi: "Lebih mudah berbagi mainan dan mau menunggu giliran saat bermain kelompok.",
      tanggal: "2026-06-20",
    },
  ],
  2: [
    {
      id: 5,
      aspek: "bahasa",
      deskripsi: "Percaya diri berbicara di depan umum, artikulasi kata sudah jelas.",
      tanggal: "2026-07-12",
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

const TABS = [
  { key: "kegiatan", label: "Kegiatan Harian" },
  { key: "perkembangan", label: "Perkembangan" },
];

const KegiatanHarian = () => {
  const [selectedAnak, setSelectedAnak] = useState(DUMMY_ANAK[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("kegiatan");
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  const kegiatan = useMemo(
    () =>
      (DUMMY_KEGIATAN[selectedAnak] || [])
        .slice()
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)),
    [selectedAnak]
  );

  const perkembangan = useMemo(
    () => (DUMMY_PERKEMBANGAN[selectedAnak] || []),
    [selectedAnak]
  );

  const perkembanganByAspek = useMemo(() => {
    const grouped = {};
    perkembangan.forEach((p) => {
      if (!grouped[p.aspek]) grouped[p.aspek] = [];
      grouped[p.aspek].push(p);
    });
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    );
    return grouped;
  }, [perkembangan]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Perkembangan Anak</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ikuti aktivitas harian dan perkembangan akademik anak Anda di sekolah.
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

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Kegiatan Harian */}
      {activeTab === "kegiatan" && (
        <div className="space-y-4">
          {kegiatan.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
              Belum ada kegiatan harian yang tercatat.
            </div>
          ) : (
            <ol className="relative space-y-5 border-l-2 border-slate-100 pl-6">
              {kegiatan.map((k) => (
                <li key={k.id} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  <button
                    onClick={() => setSelectedKegiatan(k)}
                    className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={13} />
                      {formatTanggal(k.tanggal)}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{k.judul}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{k.deskripsi}</p>
                    {k.fotoUrl && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <ImageIcon size={13} />
                        Ada foto kegiatan
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Tab: Perkembangan */}
      {activeTab === "perkembangan" && (
        <div className="space-y-5">
          {perkembangan.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
              Belum ada catatan perkembangan untuk anak ini.
            </div>
          ) : (
            Object.entries(ASPEK_CONFIG).map(([key, cfg]) => {
              const items = perkembanganByAspek[key];
              if (!items || items.length === 0) return null;
              const Icon = cfg.icon;
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-md ${cfg.bg} px-2.5 py-1 text-xs font-semibold ${cfg.text}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {items.map((p) => (
                      <li key={p.id} className="px-5 py-3.5">
                        <p className="text-sm text-slate-700">{p.deskripsi}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatTanggal(p.tanggal)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal detail kegiatan */}
      {selectedKegiatan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={13} />
                {formatTanggal(selectedKegiatan.tanggal)}
              </div>
              <button
                onClick={() => setSelectedKegiatan(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 px-6 py-5">
              {selectedKegiatan.fotoUrl ? (
                <img
                  src={selectedKegiatan.fotoUrl}
                  alt={selectedKegiatan.judul}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
                  <ImageIcon size={32} />
                </div>
              )}
              <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <Sparkles size={16} className="text-emerald-500" />
                {selectedKegiatan.judul}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {selectedKegiatan.deskripsi}
              </p>
            </div>

            <div className="border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setSelectedKegiatan(null)}
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

export default KegiatanHarian;