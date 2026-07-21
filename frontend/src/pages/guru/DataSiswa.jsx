// src/pages/guru/DataSiswa.jsx
import { useMemo, useState } from "react";
import { Search, Users2, Cake, UsersRound } from "lucide-react";
import { useSiswaList } from "../../hooks/useSiswaList";

export default function DataSiswa() {
  const { siswaList, loading } = useSiswaList();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return siswaList;
    const q = query.toLowerCase();
    return siswaList.filter(
      (s) =>
        s.nama.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q),
    );
  }, [siswaList, query]);

  const totalLaki = siswaList.filter((s) => s.jenisKelamin === "LAKI_LAKI").length;
  const totalPerempuan = siswaList.length - totalLaki;

  function calcAge(tgl) {
    if (!tgl) return "-";
    const diff = Date.now() - new Date(tgl).getTime();
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    const y = Math.floor(years);
    const m = Math.floor((years - y) * 12);
    return `${y} th ${m} bln`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Data Siswa
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Daftar siswa di kelas yang kamu ampu.
        </p>
      </div>

      {/* Stat ringkas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C8A7D]/10">
            <Users2 size={18} className="text-[#3C8A7D]" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {loading ? "…" : siswaList.length}
            </p>
            <p className="text-xs text-slate-500">Total Siswa</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B8DEF]/10">
            <UsersRound size={18} className="text-[#5B8DEF]" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {loading ? "…" : totalLaki}
            </p>
            <p className="text-xs text-slate-500">Siswa Laki-laki</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6F59]/10">
            <UsersRound size={18} className="text-[#FF6F59]" />
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">
              {loading ? "…" : totalPerempuan}
            </p>
            <p className="text-xs text-slate-500">Siswa Perempuan</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="relative block max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau NIS…"
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
                <th className="px-5 py-3 font-semibold">Nama Siswa</th>
                <th className="px-5 py-3 font-semibold">NIS</th>
                <th className="px-5 py-3 font-semibold">Kelas</th>
                <th className="px-5 py-3 font-semibold">Jenis Kelamin</th>
                <th className="px-5 py-3 font-semibold">Usia</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
                        <span className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-3.5 w-16 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-3.5 w-14 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-3.5 w-20 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block h-3.5 w-16 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Users2 size={26} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">
                      {query
                        ? "Tidak ada siswa yang cocok dengan pencarianmu."
                        : "Belum ada data siswa."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
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
                    <td className="px-5 py-3.5 text-slate-600">{s.nis}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {s.kelas?.nama ? `Kelas ${s.kelas.nama}` : "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          s.jenisKelamin === "LAKI_LAKI"
                            ? "bg-[#5B8DEF]/10 text-[#5B8DEF]"
                            : "bg-[#FF6F59]/10 text-[#FF6F59]"
                        }`}
                      >
                        {s.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Cake size={12} /> {calcAge(s.tanggalLahir)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
            Menampilkan {filtered.length} dari {siswaList.length} siswa
          </div>
        )}
      </div>
    </div>
  );
}