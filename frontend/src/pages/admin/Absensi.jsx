import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, Save, Users } from "lucide-react";
import api from "../../services/api";
import { useKelasList } from "../../hooks/useKelasList";
import { useSiswaList } from "../../hooks/useSiswaList";

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir", active: "bg-emerald-500 text-white", idle: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { value: "IZIN", label: "Izin", active: "bg-amber-500 text-white", idle: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
  { value: "SAKIT", label: "Sakit", active: "bg-sky-500 text-white", idle: "bg-sky-50 text-sky-700 hover:bg-sky-100" },
  { value: "ALPA", label: "Alpa", active: "bg-rose-500 text-white", idle: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Absensi() {
  const { siswaList, loading: loadingSiswa } = useSiswaList();
  const { kelasList } = useKelasList();
  const [kelasId, setKelasId] = useState("");
  const [tanggal, setTanggal] = useState(todayISO());
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const siswaKelas = useMemo(
    () => siswaList.filter((s) => !kelasId || String(s.kelas?.id) === kelasId),
    [siswaList, kelasId],
  );

  useEffect(() => {
    if (!tanggal) return;
    setMessage("");
    api.get("/absensi", { params: { tanggal } })
      .then((res) => {
        const nextRows = {};
        (res.data.data || []).forEach((item) => {
          nextRows[item.siswaId] = {
            status: item.status,
            keterangan: item.keterangan || "",
          };
        });
        setRows(nextRows);
      })
      .catch(() => {
        setRows({});
        setError("Gagal memuat absensi pada tanggal yang dipilih.");
      });
  }, [tanggal]);

  function updateRow(siswaId, field, value) {
    setRows((previous) => ({
      ...previous,
      [siswaId]: { ...previous[siswaId], [field]: value },
    }));
    setMessage("");
  }

  async function handleSaveAll() {
    const entries = siswaKelas
      .map((siswa) => ({ siswaId: siswa.id, ...rows[siswa.id] }))
      .filter((item) => item.status);

    if (!entries.length) {
      setError("Pilih status kehadiran minimal untuk satu siswa.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await Promise.all(entries.map((item) => api.post("/absensi", {
        siswaId: item.siswaId,
        tanggal,
        status: item.status,
        keterangan: item.keterangan || undefined,
      })));
      setMessage("Absensi berhasil disimpan.");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan absensi.");
    } finally {
      setSaving(false);
    }
  }

  const summary = STATUS_OPTIONS.map((option) => ({
    ...option,
    count: siswaKelas.filter((siswa) => rows[siswa.id]?.status === option.value).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Kelola Absensi</h1>
        <p className="mt-1 text-sm text-slate-500">Pilih kelas dan tanggal, lalu catat kehadiran setiap siswa.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <label className="flex-1"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500"><Users size={12} /> Kelas</span>
          <select value={kelasId} onChange={(event) => setKelasId(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10">
            <option value="">Semua kelas</option>{kelasList.map((kelas) => <option key={kelas.id} value={kelas.id}>Kelas {kelas.nama}</option>)}
          </select>
        </label>
        <label className="flex-1"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500"><CalendarDays size={12} /> Tanggal</span>
          <input type="date" value={tanggal} onChange={(event) => setTanggal(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10" />
        </label>
        <button onClick={handleSaveAll} disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-[#16302C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:cursor-not-allowed disabled:opacity-60"><Save size={15} />{saving ? "Menyimpan…" : "Simpan Semua"}</button>
      </div>

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

      {!loadingSiswa && siswaKelas.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{summary.map((item) => <div key={item.value} className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-sm"><p className="text-lg font-bold text-slate-900">{item.count}</p><p className="text-xs text-slate-500">{item.label}</p></div>)}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500"><th className="px-5 py-3 font-semibold">Nama Siswa</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Keterangan</th></tr></thead><tbody>
        {loadingSiswa ? <tr><td colSpan={3} className="px-5 py-12 text-center text-slate-500">Memuat data siswa…</td></tr> : siswaKelas.length === 0 ? <tr><td colSpan={3} className="px-5 py-12 text-center"><ClipboardCheck size={26} className="mx-auto text-slate-300" /><p className="mt-3 text-sm text-slate-500">Tidak ada siswa di kelas ini.</p></td></tr> : siswaKelas.map((siswa) => <tr key={siswa.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">{siswa.nama.split(" ").map((name) => name[0]).slice(0, 2).join("")}</span><span className="font-medium text-slate-800">{siswa.nama}</span></div></td><td className="px-5 py-3.5"><div className="flex flex-wrap gap-1.5">{STATUS_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => updateRow(siswa.id, "status", option.value)} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${rows[siswa.id]?.status === option.value ? option.active : option.idle}`}>{option.label}</button>)}</div></td><td className="px-5 py-3.5"><input value={rows[siswa.id]?.keterangan || ""} onChange={(event) => updateRow(siswa.id, "keterangan", event.target.value)} placeholder="Opsional" className="w-full min-w-[140px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm outline-none focus:border-[#3C8A7D]/40 focus:bg-white" /></td></tr>)}
      </tbody></table></div></div>
    </div>
  );
}
