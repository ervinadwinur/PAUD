import { useEffect, useState } from "react";
import pengaturanService from "../../services/pengaturanService";

const Pengaturan = () => {
  const [form, setForm] = useState({ nama: "", alamat: "", noTelepon: "", email: "", namaKepala: "" });
  const [pesan, setPesan] = useState("");
  useEffect(() => { pengaturanService.get().then((res) => setForm(res.data.data)); }, []);
  const simpan = async (e) => { e.preventDefault(); try { const res = await pengaturanService.update(form); setForm(res.data.data); setPesan("Pengaturan berhasil disimpan."); } catch (err) { setPesan(err.response?.data?.message || "Gagal menyimpan pengaturan."); } };
  return <div className="max-w-2xl p-6"><h1 className="text-3xl font-bold">Pengaturan Sekolah</h1><p className="mt-2 text-gray-600">Kelola identitas sekolah yang tampil di aplikasi.</p>{pesan && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">{pesan}</p>}<form onSubmit={simpan} className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-sm">{[["nama", "Nama sekolah"],["alamat", "Alamat"],["noTelepon", "Nomor telepon"],["email", "Email"],["namaKepala", "Nama kepala sekolah"]].map(([key,label]) => <label key={key} className="block text-sm font-medium text-gray-700">{label}<input value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>)}<button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Simpan Perubahan</button></form></div>;
};

export default Pengaturan;
