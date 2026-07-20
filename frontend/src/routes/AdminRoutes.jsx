import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import KelolaGuru from "../pages/admin/KelolaGuru";
import KelolaKelas from "../pages/admin/KelolaKelas";
import KelolaPembayaran from "../pages/admin/KelolaPembayaran";
import KelolaSiswa from "../pages/admin/KelolaSiswa";
import Laporan from "../pages/admin/Laporan";
import Pengaturan from "../pages/admin/Pengaturan";
import KelolaOrangTua from "../pages/admin/KelolaOrangTua";
import Absensi from "../pages/admin/Absensi";
import Pengumuman from "../pages/admin/Pengumuman"
import KelolaPengguna from "../pages/admin/KelolaPengguna";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="guru" element={<KelolaGuru />} />
      <Route path="kelas" element={<KelolaKelas />} />
      <Route path="pembayaran" element={<KelolaPembayaran />} />
      <Route path="siswa" element={<KelolaSiswa />} />
      <Route path="laporan" element={<Laporan />} />
      <Route path="pengaturan" element={<Pengaturan />} />
      <Route path="orangtua" element={<KelolaOrangTua />} />
      <Route path="absensi" element={<Absensi />} />
      <Route path="pengumuman" element={<Pengumuman />} />
      <Route path="pengguna" element={<KelolaPengguna />} />
    </Routes>
  );
};

export default AdminRoutes;