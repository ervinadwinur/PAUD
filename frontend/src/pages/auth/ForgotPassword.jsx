import { useState } from "react";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await authService.forgotPassword({
        email,
      });

      setMessage(
        response.data.message || "Link reset password berhasil dikirim.",
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Gagal mengirim link reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Lupa Password</h1>

        {message && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              placeholder="Masukkan Email"
              className="w-full border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
