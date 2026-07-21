// src/pages/guru/InputKegiatanHarian.jsx
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Users,
  Save,
  Clock,
  Sparkles,
  ImagePlus,
  X,
} from "lucide-react";
import api from "../../services/api";
import { useKelasList } from "../../hooks/useKelasList";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function InputKegiatanHarian() {
  const { kelasList } = useKelasList();
  const fileInputRef = useRef(null);

  const [kelasId, setKelasId] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());
  const [tema, setTema] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [catatan, setCatatan] = useState("");

  const [fotoFile, setFotoFile] = useState(null); // File baru yang dipilih user
  const [fotoPreview, setFotoPreview] = useState(null); // URL untuk ditampilkan (baru atau lama)
  const [fotoUrlLama, setFotoUrlLama] = useState(null); // Foto yang sudah tersimpan di server
  const [hapusFotoLama, setHapusFotoLama] = useState(false);

  const [entryId, setEntryId] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setEntryId(null);
    setTema("");
    setDeskripsi("");
    setCatatan("");
    setFotoFile(null);
    setFotoPreview(null);
    setFotoUrlLama(null);
    setHapusFotoLama(false);
  }

  // Muat entri yang sudah tersimpan untuk kelas + tanggal ini (kalau ada)
  useEffect(() => {
    if (!kelasId || !tanggal) {
      resetForm();
      return;
    }
    setLoadingForm(true);
    api
      .get("/kegiatan-harian", { params: { kelasId, tanggal } })
      .then((res) => {
        const existing = res.data.data?.[0];
        if (existing) {
          setEntryId(existing.id);
          setTema(existing.tema || "");
          setDeskripsi(existing.deskripsi || "");
          setCatatan(existing.catatan || "");
          setFotoUrlLama(existing.fotoUrl || null);
          setFotoPreview(existing.fotoUrl || null);
          setFotoFile(null);
          setHapusFotoLama(false);
        } else {
          resetForm();
        }
      })
      .catch(() => resetForm())
      .finally(() => setLoadingForm(false));
  }, [kelasId, tanggal]);

  // Muat riwayat kegiatan untuk kelas terpilih
  useEffect(() => {
    if (!kelasId) {
      setRiwayat([]);
      setLoadingRiwayat(false);
      return;
    }
    setLoadingRiwayat(true);
    api
      .get("/kegiatan-harian", { params: { kelasId } })
      .then((res) => setRiwayat(res.data.data || []))
      .catch(() => setRiwayat([]))
      .finally(() => setLoadingRiwayat(false));
  }, [kelasId, message]);

  function handlePickFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError("");
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
    setHapusFotoLama(false);
  }

  function handleHapusFoto() {
    setFotoFile(null);
    setFotoPreview(null);
    setHapusFotoLama(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!kelasId) {
      setError("Pilih kelas terlebih dahulu.");
      return;
    }
    if (!tema.trim()) {
      setError("Tema kegiatan wajib diisi.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      if (entryId) formData.append("id", entryId);
      formData.append("kelasId", kelasId);
      formData.append("tanggal", tanggal);
      formData.append("tema", tema);
      formData.append("deskripsi", deskripsi);
      if (catatan) formData.append("catatan", catatan);
      if (fotoFile) formData.append("foto", fotoFile);
      if (hapusFotoLama) formData.append("hapusFoto", "true");

      await api.post("/kegiatan-harian", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Kegiatan harian berhasil disimpan.");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan kegiatan.");
    } finally {
      setSaving(false);
    }
  }

  function loadFromRiwayat(item) {
    setTanggal(item.tanggal.slice(0, 10));
    setEntryId(item.id);
    setTema(item.tema || "");
    setDeskripsi(item.deskripsi || "");
    setCatatan(item.catatan || "");
    setFotoUrlLama(item.fotoUrl || null);
    setFotoPreview(item.fotoUrl || null);
    setFotoFile(null);
    setHapusFotoLama(false);
    setMessage("");
    setError("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Input Kegiatan Harian
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Catat tema, aktivitas, dan dokumentasi foto kelas hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-4 lg:col-span-2">
          {/* Filter kelas & tanggal */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
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
                <CalendarDays size={12} /> Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
              />
            </div>
          </div>

          {/* Notifikasi */}
          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm font-medium text-[#C4432F]">
              {error}
            </div>
          )}

          {/* Form kegiatan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {!kelasId ? (
              <div className="py-10 text-center">
                <BookOpen size={26} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">
                  Pilih kelas terlebih dahulu untuk mulai menulis kegiatan.
                </p>
              </div>
            ) : loadingForm ? (
              <div className="space-y-3">
                <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : (
              <div className="space-y-4">
                {entryId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3C8A7D]/10 px-3 py-1 text-xs font-medium text-[#3C8A7D]">
                    <Sparkles size={12} /> Mengedit kegiatan yang sudah tersimpan
                  </span>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Tema Kegiatan
                  </label>
                  <input
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    placeholder="Contoh: Mengenal Hewan di Sekitar Kita"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Rincian Kegiatan
                  </label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={5}
                    placeholder="Ceritakan aktivitas belajar hari ini — permainan, materi yang diperkenalkan, kegiatan motorik, dsb."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  />
                </div>

                {/* Upload foto */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Foto Kegiatan{" "}
                    <span className="font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>

                  {fotoPreview ? (
                    <div className="relative w-fit">
                      <img
                        src={fotoPreview}
                        alt="Pratinjau foto kegiatan"
                        className="h-44 w-full max-w-xs rounded-xl border border-slate-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleHapusFoto}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-500"
                        aria-label="Hapus foto"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-[#3C8A7D]/40 hover:text-[#3C8A7D]"
                    >
                      <ImagePlus size={22} />
                      <span className="text-xs font-medium">
                        Klik untuk unggah foto
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePickFoto}
                    className="hidden"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Format JPG/PNG, maksimal 5MB.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Catatan Tambahan{" "}
                    <span className="font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    rows={3}
                    placeholder="Hal yang perlu diperhatikan, kendala, atau catatan untuk orang tua."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#16302C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={15} />
                    {saving
                      ? "Menyimpan…"
                      : entryId
                        ? "Simpan Perubahan"
                        : "Simpan Kegiatan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Riwayat kegiatan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <Clock size={16} className="text-slate-400" />
            Riwayat Kegiatan
          </h2>

          {!kelasId ? (
            <p className="mt-4 text-sm text-slate-400">
              Pilih kelas untuk melihat riwayat.
            </p>
          ) : loadingRiwayat ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : riwayat.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Belum ada kegiatan yang tercatat untuk kelas ini.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {riwayat.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => loadFromRiwayat(item)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                      item.id === entryId
                        ? "border-[#3C8A7D]/40 bg-[#3C8A7D]/5"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {item.fotoUrl ? (
                      <img
                        src={item.fotoUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                        <BookOpen size={16} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.tema || "(Tanpa tema)"}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}