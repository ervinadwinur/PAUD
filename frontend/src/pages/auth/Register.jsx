import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
      noTelepon: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.konfirmasiPassword) {
      return alert("Konfirmasi password tidak sama.");
    }

    try {
      setLoading(true);

      const username = form.email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
      await authService.register({ username, nama: form.nama, email: form.email, password: form.password, noTelepon: form.noTelepon });

      alert("Registrasi berhasil.");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            className="w-full border rounded-lg p-3"
            value={form.nama}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="konfirmasiPassword"
            placeholder="Konfirmasi Password"
            className="w-full border rounded-lg p-3"
            value={form.konfirmasiPassword}
            onChange={handleChange}
            required
          />

          <input type="tel" name="noTelepon" placeholder="Nomor WhatsApp" className="w-full border rounded-lg p-3" value={form.noTelepon} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
