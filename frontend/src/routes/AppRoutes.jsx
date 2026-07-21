import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import AdminRoutes from "./AdminRoutes";
import GuruRoutes from "./GuruRoutes";
import OrangTuaRoutes from "./OrangTuaRoutes";
import OrangtuaLayout from "../layouts/OrangtuaLayout";
import GuruLayout from "../layouts/GuruLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin — AdminLayout jadi wrapper, AdminRoutes dirender di Outlet-nya */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* Guru */}
      <Route path="/guru/*" element={<GuruLayout />}>
        <Route path="*" element={<GuruRoutes />} />
      </Route>

        {/* Orang Tua */}
        <Route path="/orangtua/*" element={<OrangtuaLayout/>}>
        <Route path="*" element={<OrangTuaRoutes />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;