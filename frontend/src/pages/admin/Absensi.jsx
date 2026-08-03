import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Save,
  Thermometer,
  Users,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import { useGuruList } from "../../hooks/useGuruList";

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir", icon: CheckCircle2, active: "bg-emerald-500 text-white", idle: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { value: "IZIN", label: "Izin", icon: Clock, active: "bg-amber-500 text-white", idle: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
  { value: "SAKIT", label: "Sakit", icon: Thermometer, active: "bg-sky-500 text-white", idle: "bg-sky-50 text-sky-700 hover:bg-sky-100" },
  { value: "ALPA", label: "Alpa", icon: XCircle, active: "bg-rose-500 text-white", idle: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
];

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function AbsensiGuru() {
  const { guruList, loading: loadingGuru } = useGuruList();
  const [tanggal, setTanggal] = useState(todayISO());
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tanggal) return;
    setMessage("");
    setError("");
    api
      .get("/absensi", { params: { tanggal, tipe: "GURU" } })
      .then((res) => {
        const nextRows = {};
        (res.data.data || []).forEach((item) => {
          nextRows[item.guruId] = {
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

  function updateRow(guruId, field, value) {
    setRows((previous) => ({
      ...previous,
      [guruId]: { ...previous[guruId], [field]: value },
    }));
    setMessage("");
  }

  function setAllHadir() {
    setRows((previous) => {
      const next = { ...previous };
      guruList.forEach((g) => {
        next[g.id] = { ...next[g.id], status: "HADIR" };
      });
      return next;
    });
    setMessage("");
  }

  async function handleSaveAll() {
    const entries = guruList
      .map((guru) => ({ guruId: guru.id, ...rows[guru.id] }))
      .filter((item) => item.status);

    if (!entries.length) {
      setError("Pilih status kehadiran minimal untuk satu guru.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await Promise.all(
        entries.map((item) =>
          api.post("/absensi", {
            guruId: item.guruId,
            tanggal,
            status: item.status,
            keterangan: item.keterangan || undefined,
          }),
        ),
      );
      setMessage("Absensi guru berhasil disimpan.");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan absensi.");
    } finally {
      setSaving(false);
    }
  }

  const summary = STATUS_OPTIONS.map((option) => ({
    ...option,
    count: guruList.filter((guru) => rows[guru.id]?.status === option.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Absensi Guru
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tandai kehadiran guru untuk hari ini.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-[#3C8A7D]/40 focus:ring-4 focus:ring-[#3C8A7D]/10"
            />
          </label>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16302C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Menyimpan…" : "Simpan Semua"}
          </button>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
            error ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {error || message}
        </div>
      )}

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.value}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.active}`}>
                <Icon size={16} />
              </span>
              <div>
                <p className="text-lg font-bold text-slate-900">{s.count}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daftar guru */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users size={16} className="text-slate-400" />
            {guruList.length} guru
          </span>
          <button onClick={setAllHadir} className="text-xs font-medium text-[#3C8A7D] hover:underline">
            Tandai semua hadir
          </button>
        </div>

        {loadingGuru ? (
          <p className="px-5 py-6 text-sm text-slate-400">Memuat daftar guru…</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {guruList.map((g) => {
              const currentStatus = rows[g.id]?.status;
              return (
                <li
                  key={g.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C8A7D] text-xs font-bold text-white">
                      {g.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <span className="font-medium text-slate-800">{g.nama}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {STATUS_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = currentStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateRow(g.id, "status", opt.value)}
                          className={`flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium transition-colors ${
                            active ? opt.active : opt.idle
                          }`}
                        >
                          <Icon size={13} />
                          {opt.label}
                        </button>
                      );
                    })}

                    {(currentStatus === "IZIN" || currentStatus === "SAKIT") && (
                      <input
                        type="text"
                        value={rows[g.id]?.keterangan || ""}
                        onChange={(e) => updateRow(g.id, "keterangan", e.target.value)}
                        placeholder="Keterangan (opsional)"
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#3C8A7D]/40 focus:ring-2 focus:ring-[#3C8A7D]/10 sm:w-40"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}