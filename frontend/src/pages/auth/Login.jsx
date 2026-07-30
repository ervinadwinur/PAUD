// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sprout, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const roleHome = {
  admin: "/admin/dashboard",
  guru: "/guru/dashboard",
  orangtua: "/orangtua/dashboard",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo =
        location.state?.from?.pathname || roleHome[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Panel kiri — brand & identitas, disembunyikan di mobile */}
      <div className="relative hidden w-[44%] shrink-0 overflow-hidden bg-[#16302C] lg:flex lg:flex-col lg:justify-between">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#3C8A7D]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#FF6F59]/10 blur-3xl" />

        {/* Brand */}
        <div className="relative px-12 pt-12">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C8A7D] shadow-sm">
              <Sprout size={20} className="text-white" strokeWidth={2.3} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-base font-bold tracking-tight text-white">
                PAUD Kober Al-Musyawaroh
              </p>
              <p className="text-[11px] text-[#9FB3AC]">
                Sistem Informasi PAUD
              </p>
            </div>
          </div>
        </div>

        {/* Signature: tahapan tumbuh */}
        <div className="relative px-12">
          <p className="font-display text-[26px] font-bold leading-snug text-white">
            Setiap tunas tumbuh
            <br />
            dengan caranya sendiri.
          </p>
          <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-[#B9C7C1]">
            Pantau perkembangan, absensi, dan rapor si kecil dalam satu
            tempat — bersama guru dan orang tua.
          </p>

          <div className="mt-10 flex items-end gap-3">
            {[
              { h: "h-8", delay: "0ms" },
              { h: "h-12", delay: "80ms" },
              { h: "h-16", delay: "160ms" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex ${s.h} w-11 flex-col items-center justify-end rounded-t-full rounded-b-lg bg-gradient-to-t from-[#3C8A7D] to-[#5BAE9F] transition-all duration-700 motion-reduce:transition-none ${
                  mounted ? "opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: mounted ? s.delay : "0ms" }}
              >
                <Sprout
                  size={14}
                  className="mb-1.5 text-white/90"
                  strokeWidth={2.5}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-12 pb-10">
          <div className="h-px w-full bg-white/10" />
          <p className="mt-5 text-xs text-[#7F9891]">
            PAUD Kober Al-Musyawaroh
          </p>
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div
          className={`w-full max-w-sm transition-all duration-500 motion-reduce:transition-none ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {/* Brand mobile-only */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C8A7D] shadow-sm">
              <Sprout size={18} className="text-white" strokeWidth={2.3} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold tracking-tight text-slate-900">
                Tunas Ceria
              </p>
              <p className="text-[11px] text-slate-400">
                Sistem Informasi PAUD
              </p>
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke akun Anda
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Gunakan email yang terdaftar di sekolah.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-[#FF6F59]/20 bg-[#FF6F59]/5 px-4 py-3 text-sm text-[#C4432F]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Kata sandi
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#3C8A7D] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#3C8A7D]/40 focus:bg-white focus:ring-4 focus:ring-[#3C8A7D]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#16302C] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E3D3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Memproses…"
              ) : (
                <>
                  Masuk
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-medium text-[#3C8A7D] hover:underline"
            >
              Hubungi admin sekolah
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}