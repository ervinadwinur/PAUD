// src/pages/guru/Perkembangan.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSiswaList } from "../../hooks/useSiswaList";


const ASPEK_OPTIONS = [
  "Motorik Kasar",
  "Motorik Halus",
  "Kognitif",
  "Bahasa",
  "Sosial-Emosional",
  "Moral & Agama",
  "Seni",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function InputPerkembangan() {
  const { siswaList } = useSiswaList();

  const [form, setForm] = useState({
    siswaId: "",
    aspek: ASPEK_OPTIONS[0],
    deskripsi: "",
    tanggal: todayISO(),
  });
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function loadRiwayat() {
    setLoadingRiwayat(true);
    api
      .get("/perkembangan")
      .then((res) => setRiwayat(res.data.data.slice(0, 10)))
      .catch(() => setRiwayat([]))
      .finally(() => setLoadingRiwayat(false));
  }

  useEffect(() => {
    loadRiwayat();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.post("/perkembangan", form);
      setMessage("Catatan perkembangan berhasil disimpan.");
      setForm({ siswaId: "", aspek: ASPEK_OPTIONS[0], deskripsi: "", tanggal: todayISO() });
      loadRiwayat();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan catatan perkembangan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
        Perkembangan Anak
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Catat perkembangan siswa berdasarkan aspek tumbuh kembang.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Siswa</label>
            <select
              required
              value={form.siswaId}
              onChange={(e) => setForm({ ...form, siswaId: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
            >
              <option value="">Pilih siswa…</option>
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} {s.kelas ? `(${s.kelas.nama})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Aspek</label>
            <select
              value={form.aspek}
              onChange={(e) => setForm({ ...form, aspek: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
            >
              {ASPEK_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal</label>
            <input
              type="date"
              required
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Catatan Perkembangan
            </label>
            <textarea
              required
              rows={4}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Jelaskan capaian atau observasi…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
            />
          </div>

          {message && (
            <div className="rounded-xl border border-[#3C8A7D]/20 bg-[#3C8A7D]/5 px-4 py-3 text-sm text-[#3C8A7D]">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm text-[#C4432F]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#16302C] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:opacity-60"
          >
            {saving ? "Menyimpan…" : "Simpan Catatan"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-700">Riwayat Terbaru</h2>
          <div className="mt-3 space-y-3">
            {loadingRiwayat ? (
              <p className="text-sm text-slate-400">Memuat…</p>
            ) : riwayat.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada catatan perkembangan.</p>
            ) : (
              riwayat.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{r.siswa?.nama}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.tanggal).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className="mt-1 inline-block rounded-full bg-[#3C8A7D]/10 px-2 py-0.5 text-xs font-medium text-[#3C8A7D]">
                    {r.aspek}
                  </span>
                  <p className="mt-1.5 text-sm text-slate-600">{r.deskripsi}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}