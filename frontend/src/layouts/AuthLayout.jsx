// src/layouts/AuthLayout.jsx
// Shell untuk halaman auth (Login, Register, ForgotPassword). Panel kiri
// branding disembunyikan di layar kecil, panel kanan berisi <Outlet /> (form).
import { Outlet } from "react-router-dom";
import { Sprout, ShieldCheck, Users2, HeartHandshake } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, text: "Data siswa & guru tersimpan aman dan terpusat" },
  { icon: Users2, text: "Akses berbeda untuk Admin, Guru, dan Orang Tua" },
  {
    icon: HeartHandshake,
    text: "Orang tua bisa pantau perkembangan anak kapan saja",
  },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Panel branding — desktop only */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#16302C] p-12 text-[#E7E2D6] lg:flex">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#3C8A7D]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#FF6F59]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6F59] shadow-sm">
            <Sprout size={21} className="text-white" strokeWidth={2.3} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold tracking-tight text-white">
              Tunas Ceria
            </p>
            <p className="text-xs text-[#9FB3AC]">Sistem Informasi PAUD</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-snug text-white">
            Kelola tumbuh kembang anak, dari satu tempat.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-[#B7C6C0]">
            Satu platform untuk admin sekolah, guru kelas, dan orang tua tetap
            terhubung setiap hari.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} className="text-[#E7E2D6]" />
                </span>
                <span className="text-sm text-[#C7D3CD]">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-[#71897F]">
          &copy; {new Date().getFullYear()} Tunas Ceria PAUD. Seluruh hak cipta
          dilindungi.
        </p>
      </div>

      {/* Panel form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Brand mobile only */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6F59]">
              <Sprout size={18} className="text-white" strokeWidth={2.3} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-bold tracking-tight text-slate-900">
                Tunas Ceria
              </p>
              <p className="text-[11px] text-slate-400">
                Sistem Informasi PAUD
              </p>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
