import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/guru/Dashboard";
import DataSiswa from "../pages/guru/DataSiswa";
import InputAbsensi from "../pages/guru/InputAbsensi";
import InputPenilaian from "../pages/guru/InputPerkembangan";
import Jadwal from "../pages/guru/InputKegiatanHarian";
import JurnalHarian from "../pages/guru/InputRapor";

const GuruRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="siswa" element={<DataSiswa />} />
      <Route path="absensi" element={<InputAbsensi />} />
      <Route path="penilaian" element={<InputPenilaian />} />
      <Route path="jadwal" element={<Jadwal />} />
      <Route path="jurnal" element={<JurnalHarian />} />
    </Routes>
  );
};

export default GuruRoutes;
