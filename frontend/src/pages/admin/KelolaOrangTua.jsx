// src/pages/admin/KelolaOrangTua.jsx
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Mail, Phone, Baby } from "lucide-react";

const initialOrangTua = [
  {
    id: 1,
    nama: "Rina Wijaya",
    email: "rina.wijaya@gmail.com",
    telepon: "0812-1111-2222",
    anak: ["Ahmad Fauzi"],
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Hendra Kusuma",
    email: "hendra.kusuma@gmail.com",
    telepon: "0813-2222-3333",
    anak: ["Bunga Anggraini"],
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Dewi Puspita",
    email: "dewi.puspita@gmail.com",
    telepon: "0821-3333-4444",
    anak: ["Citra Maharani"],
    status: "Non-Aktif",
  },
];

const emptyForm = { nama: "", email: "", telepon: "", anak: "", status: "Aktif" };

export default function KelolaOrangTua() {
  const [ortuList, setOrtuList] = useState(initialOrangTua);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = ortuList.filter(
    (o) =>
      o.nama.toLowerCase().includes(search.toLowerCase()) ||
      o.anak.some((a) => a.toLowerCase().includes(search.toLowerCase())),
  );

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(ortu) {
    setEditingId(ortu.id);
    setForm({ ...ortu, anak: ortu.anak.join(", ") });
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      anak: form.anak
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };
    if (editingId) {
      setOrtuList((prev) =>
        prev.map((o) => (o.id === editingId ? { ...o, ...payload } : o)),
      );
    } else {
      setOrtuList((prev) => [...prev, { ...payload, id: Date.now() }]);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    setOrtuList((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kelola Orang Tua
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data orang tua/wali siswa.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"
        >
          <Plus size={17} /> Tambah Orang Tua
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="relative block max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama orang tua atau anak…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Nama Orang Tua</th>
                <th className="px-5 py-3 font-semibold">Kontak</th>
                <th className="px-5 py-3 font-semibold">Anak</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada data orang tua yang cocok.
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                        {o.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <span className="font-medium text-slate-800">{o.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} /> {o.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={12} /> {o.telepon}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {o.anak.map((a) => (
                        <span
                          key={a}
                          className="flex items-center gap-1 rounded-full bg-[#3C8A7D]/10 px-2.5 py-1 text-xs font-medium text-[#3C8A7D]"
                        >
                          <Baby size={11} /> {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        o.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(o)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#3C8A7D]"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(o)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                        aria-label="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          Menampilkan {filtered.length} dari {ortuList.length} orang tua
        </div>
      </div>

      {/* Modal tambah/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                {editingId ? "Edit Data Orang Tua" : "Tambah Orang Tua"}
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
                  Nama Lengkap
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Nama orang tua/wali"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="email@gmail.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nomor Telepon
                </label>
                <input
                  required
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nama Anak
                </label>
                <input
                  required
                  value={form.anak}
                  onChange={(e) => setForm({ ...form, anak: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Pisahkan dengan koma jika lebih dari satu"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Contoh: Ahmad Fauzi, Zahra Fauzi
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                >
                  <option>Aktif</option>
                  <option>Non-Aktif</option>
                </select>
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
                  {editingId ? "Simpan Perubahan" : "Tambah Orang Tua"}
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
              Hapus data orang tua?
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Data <span className="font-medium">{deleteTarget.nama}</span> akan
              dihapus permanen dan tidak dapat dikembalikan.
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