import { useState } from "react";

const AbsensiForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    siswa: initialData.siswa || "",
    tanggal: initialData.tanggal || "",
    status: initialData.status || "",
    keterangan: initialData.keterangan || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Form Absensi</h2>

      <input
        type="text"
        name="siswa"
        placeholder="Nama Siswa"
        value={form.siswa}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="date"
        name="tanggal"
        value={form.tanggal}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Pilih Status</option>
        <option value="Hadir">Hadir</option>
        <option value="Izin">Izin</option>
        <option value="Sakit">Sakit</option>
        <option value="Alfa">Alfa</option>
      </select>

      <textarea
        name="keterangan"
        placeholder="Keterangan"
        value={form.keterangan}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows={3}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
};

export default AbsensiForm;
