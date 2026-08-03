import { useState, useEffect, useMemo } from "react";
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
import siswaService from "../../services/siswaService";
import kegiatanHarianService from "../../services/kegiatanHarianService";
import perkembanganService from "../../services/perkembanganService";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

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
  const [anakList, setAnakList] = useState([]);
  const [selectedAnak, setSelectedAnak] = useState(null);
  const [activeTab, setActiveTab] = useState("kegiatan");
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  const [kegiatan, setKegiatan] = useState([]);
  const [perkembangan, setPerkembangan] = useState([]);
  const [loadingAnak, setLoadingAnak] = useState(true);
  const [loadingKegiatan, setLoadingKegiatan] = useState(false);
  const [loadingPerkembangan, setLoadingPerkembangan] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Ambil daftar anak milik orang tua yang login
  useEffect(() => {
    async function fetchAnak() {
      try {
        const data = await siswaService.getAll();
        setAnakList(data);
        if (data.length > 0) setSelectedAnak(data[0]);
      } catch (err) {
        setErrorMsg("Gagal memuat data anak.");
      } finally {
        setLoadingAnak(false);
      }
    }
    fetchAnak();
  }, []);

  // Ambil kegiatan harian kelas anak yang dipilih
  useEffect(() => {
    if (!selectedAnak?.kelasId) {
      setKegiatan([]);
      return;
    }
    setLoadingKegiatan(true);
    kegiatanHarianService
      .getByKelas(selectedAnak.kelasId)
      .then(setKegiatan)
      .catch(() => setKegiatan([]))
      .finally(() => setLoadingKegiatan(false));
  }, [selectedAnak]);

  // Ambil perkembangan anak yang dipilih
  useEffect(() => {
    if (!selectedAnak?.id) {
      setPerkembangan([]);
      return;
    }
    setLoadingPerkembangan(true);
    perkembanganService
      .getBySiswa(selectedAnak.id)
      .then(setPerkembangan)
      .catch(() => setPerkembangan([]))
      .finally(() => setLoadingPerkembangan(false));
  }, [selectedAnak]);

  const perkembanganByAspek = useMemo(() => {
    const grouped = {};
    perkembangan.forEach((p) => {
      if (!grouped[p.aspek]) grouped[p.aspek] = [];
      grouped[p.aspek].push(p);
    });
    return grouped;
  }, [perkembangan]);

  if (loadingAnak) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">
        {errorMsg}
      </div>
    );
  }

  if (anakList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
        Belum ada data anak yang terdaftar pada akun Anda.
      </div>
    );
  }

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
      {anakList.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {anakList.map((anak) => (
            <button
              key={anak.id}
              onClick={() => setSelectedAnak(anak)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                selectedAnak?.id === anak.id
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {anak.nama}
            </button>
          ))}
        </div>
      )}

      {!selectedAnak?.kelasId && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {selectedAnak?.nama} belum terdaftar di kelas manapun, sehingga kegiatan harian belum bisa ditampilkan. Hubungi admin sekolah untuk melengkapi data kelas.
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
          {loadingKegiatan ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : kegiatan.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
              Belum ada kegiatan harian yang tercatat untuk kelas {selectedAnak?.kelas?.nama || "ini"}.
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
                    <p className="mt-1 text-sm font-semibold text-slate-800">{k.tema}</p>
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
          {loadingPerkembangan ? (
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ) : perkembangan.length === 0 ? (
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
                  src={`${API_BASE_URL}${selectedKegiatan.fotoUrl}`}
                  alt={selectedKegiatan.tema}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
                  <ImageIcon size={32} />
                </div>
              )}
              <h3 className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <Sparkles size={16} className="text-emerald-500" />
                {selectedKegiatan.tema}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {selectedKegiatan.deskripsi}
              </p>
              {selectedKegiatan.catatan && (
                <div className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
                  <span className="font-medium">Catatan guru: </span>
                  {selectedKegiatan.catatan}
                </div>
              )}
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