// src/pages/guru/DataSiswa.jsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSiswaList } from "../../hooks/useSiswaList";

export default function DataSiswa() {
  const { siswaList, loading } = useSiswaList();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return siswaList;
    const q = query.toLowerCase();
    return siswaList.filter(
      (s) => s.nama.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
    );
  }, [siswaList, query]);

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
        Data Siswa
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Daftar seluruh siswa yang terdaftar.
      </p>

      <div className="relative mt-5 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau NIS…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIS</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Jenis Kelamin</th>
              <th className="px-4 py-3">Tanggal Lahir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Memuat data…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Tidak ada siswa yang cocok.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.nama}</td>
                  <td className="px-4 py-3">{s.nis}</td>
                  <td className="px-4 py-3">{s.kelas?.nama ?? "-"}</td>
                  <td className="px-4 py-3">
                    {s.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(s.tanggalLahir).toLocaleDateString("id-ID")}
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