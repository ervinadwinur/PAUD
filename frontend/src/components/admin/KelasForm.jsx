import { useState } from "react";

const KelasForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    namaKelas: initialData.namaKelas || "",
    waliKelas: initialData.waliKelas || "",
    kapasitas: initialData.kapasitas || "",
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
      <h2 className="text-xl font-bold">Form Kelas</h2>

      <input
        type="text"
        name="namaKelas"
        placeholder="Nama Kelas"
        value={form.namaKelas}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="waliKelas"
        placeholder="Wali Kelas"
        value={form.waliKelas}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="kapasitas"
        placeholder="Kapasitas"
        value={form.kapasitas}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
};

export default KelasForm;
