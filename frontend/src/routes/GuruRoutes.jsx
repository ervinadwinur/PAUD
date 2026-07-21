import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/guru/Dashboard";
import DataSiswa from "../pages/guru/DataSiswa";
import InputAbsensi from "../pages/guru/InputAbsensi";
import InputPerkembangan from "../pages/guru/InputPerkembangan";
import InputKegiatanHarian from "../pages/guru/InputKegiatanHarian";
import InputRaport from "../pages/guru/InputRaport";
import Laporan from "../pages/guru/Laporan"; 

const GuruRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="siswa" element={<DataSiswa />} />
      <Route path="absensi" element={<InputAbsensi />} />
      <Route path="perkembangan" element={<InputPerkembangan />} />
      <Route path="kegiatan" element={<InputKegiatanHarian />} />
      <Route path="raport" element={<InputRaport />} />
      <Route path="laporan" element={<Laporan />} />
    </Routes>
  );
};

export default GuruRoutes;