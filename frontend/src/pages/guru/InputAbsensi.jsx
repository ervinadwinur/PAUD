// src/pages/guru/Absensi.jsx
import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import api from "../../services/api";
import { useSiswaList } from "../../hooks/useSiswaList";
import { useKelasList } from "../../hooks/useKelasList";

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir" },
  { value: "IZIN", label: "Izin" },
  { value: "SAKIT", label: "Sakit" },
  { value: "ALPA", label: "Alpa" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Absensi() {
  const { siswaList, loading: loadingSiswa } = useSiswaList();
  const { kelasList } = useKelasList();

  const [kelasId, setKelasId] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());
  const [rows, setRows] = useState({}); // { [siswaId]: { status, keterangan } }
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const siswaKelas = useMemo(
    () => siswaList.filter((s) => !kelasId || String(s.kelas?.id) === String(kelasId)),
    [siswaList, kelasId]
  );

  // Muat absensi yang sudah tersimpan untuk tanggal ini
  useEffect(() => {
    if (!tanggal) return;
    api
      .get("/absensi", { params: { tanggal } })
      .then((res) => {
        const map = {};
        res.data.data.forEach((a) => {
          map[a.siswaId] = { status: a.status, keterangan: a.keterangan || "" };
        });
        setRows(map);
      })
      .catch(() => setRows({}));
  }, [tanggal]);

  function updateRow(siswaId, field, value) {
    setRows((prev) => ({
      ...prev,
      [siswaId]: { ...prev[siswaId], [field]: value },
    }));
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const entries = siswaKelas
        .map((s) => ({ siswaId: s.id, ...rows[s.id] }))
        .filter((r) => r.status); // hanya kirim yang sudah dipilih statusnya

      if (entries.length === 0) {
        setError("Pilih status kehadiran minimal untuk satu siswa.");
        setSaving(false);
        return;
      }

      await Promise.all(
        entries.map((r) =>
          api.post("/absensi", {
            siswaId: r.siswaId,
            tanggal,
            status: r.status,
            keterangan: r.keterangan || undefined,
          })
        )
      );

      setMessage("Absensi berhasil disimpan.");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan absensi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
        Input Absensi
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Pilih kelas dan tanggal, lalu tandai kehadiran tiap siswa.
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Kelas</label>
          <select
            value={kelasId}
            onChange={(e) => setKelasId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          >
            <option value="">Semua kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          />
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#16302C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? "Menyimpan…" : "Simpan Semua"}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-[#3C8A7D]/20 bg-[#3C8A7D]/5 px-4 py-3 text-sm text-[#3C8A7D]">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm text-[#C4432F]">
          {error}
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama Siswa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingSiswa ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Memuat siswa…
                </td>
              </tr>
            ) : siswaKelas.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada siswa di kelas ini.
                </td>
              </tr>
            ) : (
              siswaKelas.map((s) => (
                <tr key={s.id} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.nama}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateRow(s.id, "status", opt.value)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                            rows[s.id]?.status === opt.value
                              ? "bg-[#16302C] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={rows[s.id]?.keterangan || ""}
                      onChange={(e) => updateRow(s.id, "keterangan", e.target.value)}
                      placeholder="Opsional"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}