import { useState } from "react";

const PenilaianForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    siswa: initialData.siswa || "",
    mataPelajaran: initialData.mataPelajaran || "",
    nilai: initialData.nilai || "",
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
      <h2 className="text-xl font-bold">Form Penilaian</h2>

      <input
        type="text"
        name="siswa"
        placeholder="Nama Siswa"
        value={form.siswa}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="mataPelajaran"
        placeholder="Mata Pelajaran"
        value={form.mataPelajaran}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="nilai"
        placeholder="Nilai"
        value={form.nilai}
        onChange={handleChange}
        className="w-full border rounded p-2"
        min="0"
        max="100"
      />

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
        className="bg-indigo-600 text-white px-5 py-2 rounded"
      >
        Simpan
      </button>
    </form>
  );
};

export default PenilaianForm;
