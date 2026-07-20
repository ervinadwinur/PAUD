import { useState } from "react";

const JurnalHarianForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    tanggal: initialData.tanggal || "",
    materi: initialData.materi || "",
    kegiatan: initialData.kegiatan || "",
    catatan: initialData.catatan || "",
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
      <h2 className="text-xl font-bold">Form Jurnal Harian</h2>

      <input
        type="date"
        name="tanggal"
        value={form.tanggal}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="materi"
        placeholder="Materi"
        value={form.materi}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="kegiatan"
        placeholder="Kegiatan Pembelajaran"
        value={form.kegiatan}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows={4}
      />

      <textarea
        name="catatan"
        placeholder="Catatan"
        value={form.catatan}
        onChange={handleChange}
        className="w-full border rounded p-2"
        rows={3}
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

export default JurnalHarianForm;
