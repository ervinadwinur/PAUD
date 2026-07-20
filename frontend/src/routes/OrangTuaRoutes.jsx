import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/orangtua/Dashboard";
import Absensi from "../pages/orangtua/Absensi";
import Pembayaran from "../pages/orangtua/Pembayaran";
import Pengumuman from "../pages/orangtua/Pengumuman";
import Perkembangan from "../pages/orangtua/Perkembangan";
import ProfilAnak from "../pages/orangtua/ProfilAnak";

const OrangTuaRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="absensi" element={<Absensi />} />
      <Route path="pembayaran" element={<Pembayaran />} />
      <Route path="pengumuman" element={<Pengumuman />} />
      <Route path="perkembangan" element={<Perkembangan />} />
      <Route path="profil-anak" element={<ProfilAnak />} />
    </Routes>
  );
};

export default OrangTuaRoutes;
