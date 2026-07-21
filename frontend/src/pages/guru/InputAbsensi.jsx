// src/pages/guru/Absensi.jsx
import { useEffect, useMemo, useState } from "react";
import { Save, Users, CalendarDays, ClipboardCheck } from "lucide-react";
import api from "../../services/api";
import { useSiswaList } from "../../hooks/useSiswaList";
import { useKelasList } from "../../hooks/useKelasList";

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir", active: "bg-emerald-500 text-white", idle: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
  { value: "IZIN", label: "Izin", active: "bg-amber-500 text-white", idle: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
  { value: "SAKIT", label: "Sakit", active: "bg-sky-500 text-white", idle: "bg-sky-50 text-sky-600 hover:bg-sky-100" },
  { value: "ALPA", label: "Alpa", active: "bg-rose-500 text-white", idle: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
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

  const summary = STATUS_OPTIONS.map((opt) => ({
    ...opt,
    count: siswaKelas.filter((s) => rows[s.id]?.status === opt.value).length,
  }));
  const belumDiisi = siswaKelas.filter((s) => !rows[s.id]?.status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Input Absensi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pilih kelas dan tanggal, lalu tandai kehadiran tiap siswa.
        </p>
      </div>

      {/* Filter & simpan */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users size={12} /> Kelas
          </label>
          <select
            value={kelasId}
            onChange={(e) => setKelasId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
          >
            <option value="">Semua kelas</option>
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
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#16302C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? "Menyimpan…" : "Simpan Semua"}
        </button>
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

      {/* Ringkasan status */}
      {!loadingSiswa && siswaKelas.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {summary.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-sm"
            >
              <p className="text-lg font-bold text-slate-900">{s.count}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5 text-center">
            <p className="text-lg font-bold text-slate-400">{belumDiisi}</p>
            <p className="text-xs text-slate-400">Belum diisi</p>
          </div>
        </div>
      )}

      {/* Tabel siswa */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Nama Siswa</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {loadingSiswa ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
                        <span className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-7 w-48 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-7 w-32 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : siswaKelas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center">
                    <ClipboardCheck size={26} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">
                      Tidak ada siswa di kelas ini.
                    </p>
                  </td>
                </tr>
              ) : (
                siswaKelas.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                          {s.nama
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <span className="font-medium text-slate-800">
                          {s.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((opt) => {
                          const active = rows[s.id]?.status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateRow(s.id, "status", opt.value)}
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                                active ? opt.active : opt.idle
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        value={rows[s.id]?.keterangan || ""}
                        onChange={(e) =>
                          updateRow(s.id, "keterangan", e.target.value)
                        }
                        placeholder="Opsional"
                        className="w-full min-w-[140px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-2 focus:ring-[#3C8A7D]/10"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}