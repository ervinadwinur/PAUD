// src/pages/admin/KelolaSiswa.jsx
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Cake, Users2 } from "lucide-react";

const kelasList = ["Kelinci", "Kupu-kupu", "Lebah"];

const initialSiswa = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    nis: "2026001",
    kelas: "Kelinci",
    tglLahir: "2021-03-12",
    namaOrtu: "Rina Wijaya",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Bunga Anggraini",
    nis: "2026002",
    kelas: "Kupu-kupu",
    tglLahir: "2020-11-05",
    namaOrtu: "Hendra Kusuma",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Citra Maharani",
    nis: "2026003",
    kelas: "Lebah",
    tglLahir: "2021-07-20",
    namaOrtu: "Dewi Puspita",
    status: "Non-Aktif",
  },
];

const emptyForm = {
  nama: "",
  nis: "",
  kelas: kelasList[0],
  tglLahir: "",
  namaOrtu: "",
  status: "Aktif",
};

export default function KelolaSiswa() {
  const [siswaList, setSiswaList] = useState(initialSiswa);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search);
    const matchKelas = filterKelas === "Semua" || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(siswa) {
    setEditingId(siswa.id);
    setForm(siswa);
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      setSiswaList((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      setSiswaList((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    setSiswaList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function calcAge(tglLahir) {
    if (!tglLahir) return "-";
    const diff = Date.now() - new Date(tglLahir).getTime();
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    const y = Math.floor(years);
    const m = Math.floor((years - y) * 12);
    return `${y} th ${m} bln`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kelola Siswa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data siswa yang terdaftar di sekolah.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"
        >
          <Plus size={17} /> Tambah Siswa
        </button>
      </div>

      {/* Stat ringkas per kelas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kelasList.map((k) => {
          const count = siswaList.filter((s) => s.kelas === k).length;
          return (
            <div
              key={k}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C8A7D]/10">
                <Users2 size={18} className="text-[#3C8A7D]" />
              </span>
              <div>
                <p className="text-lg font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500">Kelas {k}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="relative block flex-1 sm:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIS…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </label>
        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
        >
          <option value="Semua">Semua Kelas</option>
          {kelasList.map((k) => (
            <option key={k} value={k}>
              Kelas {k}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Nama Siswa</th>
                <th className="px-5 py-3 font-semibold">NIS</th>
                <th className="px-5 py-3 font-semibold">Kelas</th>
                <th className="px-5 py-3 font-semibold">Usia</th>
                <th className="px-5 py-3 font-semibold">Orang Tua</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada data siswa yang cocok.
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                        {s.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <span className="font-medium text-slate-800">{s.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{s.nis}</td>
                  <td className="px-5 py-3.5 text-slate-600">Kelas {s.kelas}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Cake size={12} /> {calcAge(s.tglLahir)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{s.namaOrtu}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        s.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#3C8A7D]"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
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
          Menampilkan {filtered.length} dari {siswaList.length} siswa
        </div>
      </div>

      {/* Modal tambah/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                {editingId ? "Edit Data Siswa" : "Tambah Siswa"}
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
                  placeholder="Nama siswa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    NIS
                  </label>
                  <input
                    required
                    value={form.nis}
                    onChange={(e) => setForm({ ...form, nis: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                    placeholder="2026004"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Kelas
                  </label>
                  <select
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  >
                    {kelasList.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Tanggal Lahir
                </label>
                <input
                  required
                  type="date"
                  value={form.tglLahir}
                  onChange={(e) => setForm({ ...form, tglLahir: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nama Orang Tua
                </label>
                <input
                  required
                  value={form.namaOrtu}
                  onChange={(e) => setForm({ ...form, namaOrtu: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Nama wali/orang tua"
                />
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
                  {editingId ? "Simpan Perubahan" : "Tambah Siswa"}
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
              Hapus data siswa?
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