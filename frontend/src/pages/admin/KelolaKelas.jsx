import { useEffect, useState } from "react";
import { GraduationCap, Pencil, Plus, School, Trash2, Users, X } from "lucide-react";
import api from "../../services/api";

const colorPalette = ["#3C8A7D", "#5B8DEF", "#F5A623", "#B26FD1", "#FF6F59"];
const emptyForm = { nama: "", guruId: "", tahunAjaran: "" };

export default function KelolaKelas() {
  const [kelasList, setKelasList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [kelasResponse, guruResponse] = await Promise.all([
        api.get("/kelas"),
        api.get("/guru"),
      ]);
      setKelasList(kelasResponse.data.data || []);
      setGuruList(guruResponse.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data kelas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(kelas) {
    setEditingId(kelas.id);
    setForm({
      nama: kelas.nama || "",
      guruId: kelas.guruId ? String(kelas.guruId) : "",
      tahunAjaran: kelas.tahunAjaran || "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        nama: form.nama.trim(),
        guruId: form.guruId || null,
        tahunAjaran: form.tahunAjaran.trim() || null,
      };
      if (editingId) {
        await api.put(`/kelas/${editingId}`, payload);
      } else {
        await api.post("/kelas", payload);
      }
      setMessage(editingId ? "Data kelas berhasil diperbarui." : "Kelas berhasil ditambahkan.");
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data kelas.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setError("");
    try {
      await api.delete(`/kelas/${deleteTarget.id}`);
      setMessage("Kelas berhasil dihapus.");
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus kelas.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Kelola Kelas</h1><p className="mt-1 text-sm text-slate-500">Kelas yang ditambahkan di sini akan tersedia saat input absensi dan data siswa.</p></div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"><Plus size={17} /> Tambah Kelas</button>
      </div>

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

      {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Memuat data kelas…</div> : kelasList.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><School size={28} className="mx-auto text-slate-300" /><p className="mt-3 text-sm text-slate-500">Belum ada kelas tersimpan. Tambahkan kelas terlebih dahulu.</p></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{kelasList.map((kelas, index) => {
        const jumlahSiswa = kelas._count?.siswa || 0;
        return <div key={kelas.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: colorPalette[index % colorPalette.length] }}><School size={20} /></span><div><p className="font-display text-base font-bold text-slate-900">Kelas {kelas.nama}</p><p className="text-xs text-slate-400">{kelas.tahunAjaran || "Tahun ajaran belum diisi"}</p></div></div><div className="flex items-center gap-1"><button onClick={() => openEditModal(kelas)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#3C8A7D]" aria-label="Edit"><Pencil size={14} /></button><button onClick={() => setDeleteTarget(kelas)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Hapus"><Trash2 size={14} /></button></div></div><div className="mt-4 flex items-center gap-2 text-sm text-slate-600"><GraduationCap size={15} className="text-slate-400" />Wali kelas: <span className="font-medium">{kelas.guru?.nama || "Belum ditentukan"}</span></div><div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Users size={15} className="text-slate-400" />{jumlahSiswa} siswa terdaftar</div></div>;
      })}</div>}

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"><div className="w-full max-w-md rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-display text-base font-bold text-slate-900">{editingId ? "Edit Data Kelas" : "Tambah Kelas"}</h2><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><form onSubmit={handleSubmit} className="space-y-4 px-5 py-5"><div><label className="mb-1.5 block text-xs font-medium text-slate-600">Nama Kelas</label><input required value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10" placeholder="Contoh: Kelinci" /></div><div><label className="mb-1.5 block text-xs font-medium text-slate-600">Wali Kelas</label><select value={form.guruId} onChange={(event) => setForm({ ...form, guruId: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"><option value="">Belum ditentukan</option>{guruList.map((guru) => <option key={guru.id} value={guru.id}>{guru.nama}</option>)}</select></div><div><label className="mb-1.5 block text-xs font-medium text-slate-600">Tahun Ajaran</label><input value={form.tahunAjaran} onChange={(event) => setForm({ ...form, tahunAjaran: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10" placeholder="Contoh: 2026/2027" /></div><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">Batal</button><button disabled={saving} type="submit" className="rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#347A6E] disabled:opacity-60">{saving ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Tambah Kelas"}</button></div></form></div></div>}

      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"><div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"><h2 className="font-display text-base font-bold text-slate-900">Hapus data kelas?</h2><p className="mt-1.5 text-sm text-slate-500">Kelas <span className="font-medium">{deleteTarget.nama}</span> akan dihapus permanen.</p><div className="mt-5 flex justify-end gap-2"><button onClick={() => setDeleteTarget(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">Batal</button><button disabled={saving} onClick={handleDelete} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-60">Hapus</button></div></div></div>}
    </div>
  );
}
