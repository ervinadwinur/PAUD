import { useState, useMemo } from "react";
import {
  FileText,
  Upload,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Download,
  FileCheck2,
} from "lucide-react";

// ================== DUMMY DATA ==================
// Ganti dengan data dari API (GET /api/siswa, GET /api/rapor?guruId=...)

const DUMMY_SISWA = [
  { id: 1, nama: "Ahmad Fauzi", kelas: "Kelompok A" },
  { id: 2, nama: "Bunga Citra", kelas: "Kelompok A" },
  { id: 3, nama: "Chandra Wijaya", kelas: "Kelompok B" },
  { id: 4, nama: "Dinda Permata", kelas: "Kelompok B" },
  { id: 5, nama: "Eka Saputra", kelas: "Kelompok A" },
];

const SEMESTER_OPTIONS = ["Ganjil", "Genap"];
const TAHUN_AJARAN_OPTIONS = ["2024/2025", "2025/2026"];

const INITIAL_RAPOR = [
  {
    id: 1,
    siswaId: 1,
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
    catatan: "Perkembangan motorik dan sosial anak sangat baik selama semester ini.",
    fileName: "rapor_ahmad_fauzi_ganjil.pdf",
    updatedAt: "2026-07-10",
  },
  {
    id: 2,
    siswaId: 3,
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
    catatan: "Perlu pendampingan lebih pada aspek bahasa dan komunikasi.",
    fileName: "rapor_chandra_wijaya_ganjil.pdf",
    updatedAt: "2026-07-12",
  },
];

const emptyForm = {
  siswaId: "",
  semester: "Ganjil",
  tahunAjaran: TAHUN_AJARAN_OPTIONS[TAHUN_AJARAN_OPTIONS.length - 1],
  catatan: "",
  file: null,
  fileName: "",
};

const InputRaport = () => {
  const [rapor, setRapor] = useState(INITIAL_RAPOR);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const siswaById = useMemo(
    () => Object.fromEntries(DUMMY_SISWA.map((s) => [s.id, s])),
    []
  );

  const filteredRapor = useMemo(() => {
    return rapor.filter((r) => {
      const nama = siswaById[r.siswaId]?.nama.toLowerCase() ?? "";
      return nama.includes(search.toLowerCase());
    });
  }, [rapor, search, siswaById]);

  const openCreatePanel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPanelOpen(true);
  };

  const openEditPanel = (item) => {
    setEditingId(item.id);
    setForm({
      siswaId: String(item.siswaId),
      semester: item.semester,
      tahunAjaran: item.tahunAjaran,
      catatan: item.catatan,
      file: null,
      fileName: item.fileName,
    });
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, file, fileName: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.siswaId || !form.catatan) return;

    if (editingId) {
      setRapor((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                siswaId: Number(form.siswaId),
                semester: form.semester,
                tahunAjaran: form.tahunAjaran,
                catatan: form.catatan,
                fileName: form.fileName || r.fileName,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : r
        )
      );
    } else {
      setRapor((prev) => [
        ...prev,
        {
          id: Date.now(),
          siswaId: Number(form.siswaId),
          semester: form.semester,
          tahunAjaran: form.tahunAjaran,
          catatan: form.catatan,
          fileName: form.fileName,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    closePanel();
  };

  const confirmDelete = () => {
    setRapor((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Input Rapor Siswa</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola rapor perkembangan siswa per semester dan tahun ajaran.
          </p>
        </div>
        <button
          onClick={openCreatePanel}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <Plus size={18} />
          Input Rapor Baru
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Rapor</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{rapor.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Siswa Terdaftar</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{DUMMY_SISWA.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Belum Dibuatkan Rapor</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">
            {DUMMY_SISWA.length - new Set(rapor.map((r) => r.siswaId)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama siswa..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Siswa</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Semester</th>
              <th className="px-4 py-3">Tahun Ajaran</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Diperbarui</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRapor.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Belum ada rapor yang cocok dengan pencarian.
                </td>
              </tr>
            )}
            {filteredRapor.map((r) => {
              const siswa = siswaById[r.siswaId];
              return (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {siswa?.nama ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{siswa?.kelas ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{r.semester}</td>
                  <td className="px-4 py-3 text-slate-600">{r.tahunAjaran}</td>
                  <td className="px-4 py-3">
                    {r.fileName ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        <FileCheck2 size={14} />
                        Tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                        Belum ada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{r.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {r.fileName && (
                        <button
                          title="Unduh file"
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Download size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => openEditPanel(r)}
                        title="Edit rapor"
                        className="rounded-md p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        title="Hapus rapor"
                        className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-in panel: Create / Edit */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? "Edit Rapor" : "Input Rapor Baru"}
              </h2>
              <button
                onClick={closePanel}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-5 px-6 py-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Siswa
                  </label>
                  <select
                    value={form.siswaId}
                    onChange={(e) => setForm((p) => ({ ...p, siswaId: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Pilih siswa</option>
                    {DUMMY_SISWA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} — {s.kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Semester
                    </label>
                    <select
                      value={form.semester}
                      onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      {SEMESTER_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Tahun Ajaran
                    </label>
                    <select
                      value={form.tahunAjaran}
                      onChange={(e) => setForm((p) => ({ ...p, tahunAjaran: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      {TAHUN_AJARAN_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Catatan Perkembangan
                  </label>
                  <textarea
                    value={form.catatan}
                    onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))}
                    required
                    rows={5}
                    placeholder="Tuliskan ringkasan perkembangan anak selama semester ini..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    File Rapor (PDF)
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600">
                    <Upload size={18} />
                    {form.fileName ? form.fileName : "Klik untuk unggah file PDF"}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Rapor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <h3 className="text-base font-semibold text-slate-800">Hapus rapor ini?</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Rapor{" "}
              <span className="font-medium text-slate-700">
                {siswaById[deleteTarget.siswaId]?.nama}
              </span>{" "}
              semester {deleteTarget.semester} {deleteTarget.tahunAjaran} akan dihapus permanen
              dan tidak dapat dikembalikan.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputRaport;