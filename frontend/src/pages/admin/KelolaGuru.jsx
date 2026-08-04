// src/pages/admin/KelolaGuru.jsx
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  Copy,
  Check,
  KeyRound,
  Wand2,
} from "lucide-react";
import api from "../../services/api";
import { useKelasList } from "../../hooks/useKelasList";

const emptyForm = {
  nama: "",
  email: "",
  telepon: "",
  kelasId: "",
  status: "Aktif",
  password: "",
};

function usernameFromEmail(email) {
  return email.split("@")[0].toLowerCase();
}

export default function KelolaGuru() {
  const { kelasList } = useKelasList();

  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [usePasswordCustom, setUsePasswordCustom] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Menampilkan password (hasil generate ATAU hasil reset) setelah berhasil
  const [credentialResult, setCredentialResult] = useState(null); // { email, password }
  const [copied, setCopied] = useState(false);

  // Reset password guru yang sudah ada
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resettingPw, setResettingPw] = useState(false);

  function fetchGuru() {
    setLoading(true);
    api
      .get("/guru")
      .then((res) => setGuruList(res.data.data || []))
      .catch(() => setGuruList([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchGuru();
  }, []);

  const filtered = guruList.filter(
    (g) =>
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      (g.kelas?.nama || "").toLowerCase().includes(search.toLowerCase()),
  );

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setUsePasswordCustom(false);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(guru) {
    setEditingId(guru.id);
    setForm({
      nama: guru.nama,
      email: guru.user?.email || "",
      telepon: guru.telepon || "",
      kelasId: guru.kelasId || "",
      status: guru.user?.isActive ? "Aktif" : "Cuti",
      password: "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/guru/${editingId}`, form);
        setModalOpen(false);
        fetchGuru();
      } else {
        const payload = {
          ...form,
          username: usernameFromEmail(form.email),
        };
        const res = await api.post("/guru", payload);
        setModalOpen(false);
        fetchGuru();
        // Kalau admin set password sendiri, backend tidak mengembalikan generatedPassword
        // jadi modal kredensial hanya muncul kalau password memang di-generate sistem.
        if (res.data.data.generatedPassword) {
          setCredentialResult({
            email: form.email,
            password: res.data.data.generatedPassword,
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data staff.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/guru/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchGuru();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus data staff.");
      setDeleteTarget(null);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (resetPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    setResettingPw(true);
    setError("");
    try {
      await api.post(`/guru/${resetTarget.id}/reset-password`, {
        password: resetPassword,
      });
      const emailTarget = resetTarget.user?.email;
      setResetTarget(null);
      setCredentialResult({ email: emailTarget, password: resetPassword });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mereset password.");
    } finally {
      setResettingPw(false);
    }
  }

  function copyCredential() {
    const text = `Email: ${credentialResult.email}\nPassword: ${credentialResult.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kelola Staff
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola akun dan data tiga staff pengajar.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#347A6E]"
        >
          <Plus size={17} /> Tambah Staff
        </button>
      </div>

      {error && !modalOpen && !resetTarget && (
        <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm font-medium text-[#C4432F]">
          {error}
        </div>
      )}

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
            placeholder="Cari nama atau kelas…"
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
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Kontak</th>
                <th className="px-5 py-3 font-semibold">Kelas</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5" colSpan={5}>
                      <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada data staff yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                          {g.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                        <span className="font-medium text-slate-800">{g.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} /> {g.user?.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} /> {g.telepon || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {g.kelas?.nama ? `Kelas ${g.kelas.nama}` : "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          g.user?.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {g.user?.isActive ? "Aktif" : "Cuti"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setResetTarget(g);
                            setResetPassword("");
                            setError("");
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#5B8DEF]"
                          aria-label="Reset Password"
                        >
                          <KeyRound size={15} />
                        </button>
                        <button
                          onClick={() => openEditModal(g)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#3C8A7D]"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(g)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                          aria-label="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
            Menampilkan {filtered.length} dari {guruList.length} staff
          </div>
        )}
      </div>

      {/* Modal tambah/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                {editingId ? "Edit Data Staff" : "Tambah Staff"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {!editingId && (
                <p className="rounded-xl bg-[#3C8A7D]/5 px-3.5 py-2.5 text-xs text-[#3C8A7D]">
                  Akun login akan dibuat otomatis untuk staff ini.
                </p>
              )}
              {error && (
                <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-3.5 py-2.5 text-sm text-[#C4432F]">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nama Lengkap
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="Nama staff"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Email {editingId && <span className="font-normal text-slate-400">(login)</span>}
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="email@tunasceria.sch.id"
                />
                {!editingId && (
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Username login: {form.email ? usernameFromEmail(form.email) : "—"}
                  </p>
                )}
              </div>

              {/* Password — hanya muncul saat tambah guru baru */}
              {!editingId && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setUsePasswordCustom((v) => !v);
                        setForm({ ...form, password: "" });
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-[#3C8A7D] hover:underline"
                    >
                      <Wand2 size={12} />
                      {usePasswordCustom ? "Generate otomatis" : "Set password sendiri"}
                    </button>
                  </div>
                  {usePasswordCustom ? (
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                    />
                  ) : (
                    <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                      Password akan digenerate otomatis dan ditampilkan setelah disimpan.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Nomor Telepon
                </label>
                <input
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Kelas
                  </label>
                  <select
                    value={form.kelasId}
                    onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
                  >
                    <option value="">Belum ditugaskan</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
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
                    <option>Cuti</option>
                  </select>
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
                  disabled={submitting}
                  className="rounded-xl bg-[#3C8A7D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#347A6E] disabled:opacity-60"
                >
                  {submitting ? "Menyimpan…" : editingId ? "Simpan Perubahan" : "Tambah Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal reset password (guru yang sudah ada) */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">
                Reset Password
              </h2>
              <button
                onClick={() => setResetTarget(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4 px-5 py-5">
              {error && (
                <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-3.5 py-2.5 text-sm text-[#C4432F]">
                  {error}
                </div>
              )}
              <p className="text-sm text-slate-500">
                Set password baru untuk{" "}
                <span className="font-medium text-slate-700">{resetTarget.nama}</span>.
              </p>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Password Baru
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5B8DEF]/40 focus:ring-4 focus:ring-[#5B8DEF]/10"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  className="rounded-xl bg-[#5B8DEF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4A7CDD] disabled:opacity-60"
                >
                  {resettingPw ? "Menyimpan…" : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal hasil kredensial — muncul setelah tambah guru (generate) ATAU reset password */}
      {credentialResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="font-display text-base font-bold text-slate-900">
              Password berhasil disetel
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sampaikan kredensial berikut ke staff. Password ini tidak akan ditampilkan lagi.
            </p>

            <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 font-mono text-sm">
              <p>
                <span className="text-slate-400">Email:</span> {credentialResult.email}
              </p>
              <p>
                <span className="text-slate-400">Password:</span> {credentialResult.password}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={copyCredential}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Tersalin" : "Salin"}
              </button>
              <button
                onClick={() => setCredentialResult(null)}
                className="rounded-xl bg-[#16302C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3D3A]"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="font-display text-base font-bold text-slate-900">
              Hapus data staff?
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Data <span className="font-medium">{deleteTarget.nama}</span> beserta
              akun loginnya akan dihapus permanen.
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
