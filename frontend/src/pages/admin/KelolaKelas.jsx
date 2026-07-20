// src/pages/admin/KelolaKelas.jsx
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Users, GraduationCap, School } from "lucide-react";

const colorPalette = ["#3C8A7D", "#5B8DEF", "#F5A623", "#B26FD1", "#FF6F59"];

const initialKelas = [
  {
    id: 1,
    nama: "Kelinci",
    waliKelas: "Siti Aminah",
    kapasitas: 20,
    jumlahSiswa: 18,
    kelompokUsia: "3-4 tahun",
  },
  {
    id: 2,
    nama: "Kupu-kupu",
    waliKelas: "Budi Santoso",
    kapasitas: 20,
    jumlahSiswa: 15,
    kelompokUsia: "4-5 tahun",
  },
  {
    id: 3,
    nama: "Lebah",
    waliKelas: "Dewi Lestari",
    kapasitas: 18,
    jumlahSiswa: 16,
    kelompokUsia: "5-6 tahun",
  },
];

const emptyForm = {
  nama: "",
  waliKelas: "",
  kapasitas: "",
  kelompokUsia: "",
};

export default function KelolaKelas() {
  const [kelasList, setKelasList] = useState(initialKelas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(kelas) {
    setEditingId(kelas.id);
    setForm({
      nama: kelas.nama,
      waliKelas: kelas.waliKelas,
      kapasitas: kelas.kapasitas,
      kelompokUsia: kelas.kelompokUsia,
    });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, kapasitas: Number(form.kapasitas) };
    if (editingId) {
      setKelasList((prev) =>
        prev.map((k) => (k.id === editingId ? { ...k, ...payload } : k)),
      );
    } else {
      setKelasList((prev) => [
        ...prev,
        { ...payload, id: Date.now(), jumlahSiswa: 0 },
      ]);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    setKelasList((prev) => prev.filter((k) => k.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kelola Kelas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data kelas, wali kelas, dan kapasitas siswa.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"
        >
          <Plus size={17} /> Tambah Kelas
        </button>
      </div>

      {/* Grid kartu kelas */}
      {kelasList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <School size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Belum ada data kelas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kelasList.map((k, i) => {
            const color = colorPalette[i % colorPalette.length];
            const pct = Math.min(
              100,
              Math.round((k.jumlahSiswa / k.kapasitas) * 100),
            );
            return (
              <div
                key={k.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: color }}
                    >
                      <School size={20} />
                    </span>
                    <div>
                      <p className="font-display text-base font-bold text-slate-900">
                        Kelas {k.nama}
                      </p>
                      <p className="text-xs text-slate-400">{k.kelompokUsia}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(k)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#3C8A7D]"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(k)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      aria-label="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <GraduationCap size={15} className="text-slate-400" />
                  Wali kelas: <span className="font-medium">{k.waliKelas}</span>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Users size={12} /> {k.jumlahSiswa}/{k.kapasitas} siswa
                    </span>
                    <span className="font-medium text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal tambah/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                {editingId ? "Edit Data Kelas" : "Tambah Kelas"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nama Kelas
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Contoh: Kelinci"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Wali Kelas
                </label>
                <input
                  required
                  value={form.waliKelas}
                  onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Nama guru wali kelas"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Kelompok Usia
                  </label>
                  <input
                    required
                    value={form.kelompokUsia}
                    onChange={(e) =>
                      setForm({ ...form, kelompokUsia: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                    placeholder="3-4 tahun"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Kapasitas
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.kapasitas}
                    onChange={(e) =>
                      setForm({ ...form, kapasitas: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#347A6E]"
                >
                  {editingId ? "Simpan Perubahan" : "Tambah Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="font-display text-base font-bold text-slate-900">
              Hapus data kelas?
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Kelas <span className="font-medium">{deleteTarget.nama}</span> akan
              dihapus permanen. Pastikan tidak ada siswa aktif di kelas ini.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}