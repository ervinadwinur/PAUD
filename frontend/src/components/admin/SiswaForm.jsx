import { useState } from "react";

const SiswaForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    nama: initialData.nama || "",
    nis: initialData.nis || "",
    kelas: initialData.kelas || "",
    jenisKelamin: initialData.jenisKelamin || "",
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
      <h2 className="text-xl font-bold">Form Siswa</h2>

      <input
        type="text"
        name="nama"
        placeholder="Nama Siswa"
        value={form.nama}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="nis"
        placeholder="NIS"
        value={form.nis}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="kelas"
        placeholder="Kelas"
        value={form.kelas}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="jenisKelamin"
        value={form.jenisKelamin}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Pilih Jenis Kelamin</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-5 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
};

export default SiswaForm;
