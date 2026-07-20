import { useState } from "react";

const GuruForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    nama: initialData.nama || "",
    nip: initialData.nip || "",
    email: initialData.email || "",
    noHp: initialData.noHp || "",
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
      <h2 className="text-xl font-bold">Form Guru</h2>

      <input
        type="text"
        name="nama"
        placeholder="Nama Guru"
        value={form.nama}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="nip"
        placeholder="NIP"
        value={form.nip}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="noHp"
        placeholder="No HP"
        value={form.noHp}
        onChange={handleChange}
        className="w-full border rounded p-2"
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

export default GuruForm;
