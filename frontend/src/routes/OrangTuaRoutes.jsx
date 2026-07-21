import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/orangtua/Dashboard";
import Absensi from "../pages/orangtua/Absensi";
import Pembayaran from "../pages/orangtua/Pembayaran";
import Raport from "../pages/orangtua/Raport";
import KegiatanHarin from "../pages/orangtua/KegiatanHarian";
import DataAnak from "../pages/orangtua/DataAnak";

const OrangTuaRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="absensi" element={<Absensi />} />
      <Route path="pembayaran" element={<Pembayaran />} />
      <Route path="raport" element={<Raport />} />
      <Route path="kegiatan" element={<KegiatanHarin />} />
      <Route path="data-anak" element={<DataAnak />} />
    </Routes>
  );
};

export default OrangTuaRoutes;
