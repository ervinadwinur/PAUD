// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Bungkus route dengan komponen ini untuk membatasi akses.
 *
 * <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *   <Route path="/admin/*" element={<AdminLayout />}>...</Route>
 * </Route>
 *
 * - Belum login → redirect ke /login (menyimpan lokasi asal untuk redirect balik)
 * - Login tapi role tidak diizinkan → redirect ke /forbidden
 * - Lolos → render <Outlet /> (route anak)
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3C8A7D] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
