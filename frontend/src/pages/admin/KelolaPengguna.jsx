import React, { useMemo, useState } from 'react';
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  User,
  Users,
  UserRound,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../services/api';
import { useUserList } from '../../hooks/useUserList';

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  role: 'GURU',
  nama: '',
  nip: '',
  noTelepon: '',
  alamat: ''
};

const ROLE_LABEL = { ADMIN: 'Admin', GURU: 'Guru', ORANGTUA: 'Orang Tua' };

function getNama(user) {
  return user.guru?.nama || user.orangTua?.nama || user.username;
}
function getNoTelp(user) {
  return user.guru?.noTelepon || user.orangTua?.noTelepon || '-';
}
function getAlamat(user) {
  return user.guru?.alamat || user.orangTua?.alamat || '-';
}
function formatTanggal(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID');
}

const KelolaPengguna = () => {
  const { userList, setUserList, loading, error, refetch } = useUserList();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Statistik pengguna
  const stats = [
    {
      label: 'Total Pengguna',
      value: userList.length,
      icon: Users,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Admin',
      value: userList.filter(u => u.role === 'ADMIN').length,
      icon: Shield,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'Guru',
      value: userList.filter(u => u.role === 'GURU').length,
      icon: User,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'Aktif',
      value: userList.filter(u => u.isActive).length,
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  // Filter pengguna
  const filteredUsers = userList.filter(user => {
    const nama = getNama(user).toLowerCase();
    const matchSearch = nama.includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'semua' || user.role === selectedRole;
    const matchStatus = selectedStatus === 'semua' ||
                       (selectedStatus === 'aktif' ? user.isActive : !user.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = useMemo(
    () => filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredUsers, currentPage],
  );

  function resetFilterDependentPage() {
    setPage(1);
  }

  // Handle tambah pengguna
  const handleAddUser = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle edit pengguna
  const handleEditUser = (id) => {
    const user = userList.find(u => u.id === id);
    if (user) {
      setEditingId(id);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        nama: getNama(user),
        nip: user.guru?.nip || '',
        noTelepon: user.guru?.noTelepon || user.orangTua?.noTelepon || '',
        alamat: user.guru?.alamat || user.orangTua?.alamat || ''
      });
      setFormError('');
      setIsModalOpen(true);
    }
  };

  // Handle delete pengguna
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    setActionError('');
    setDeletingId(id);
    try {
      await api.delete(`/pengguna/${id}`);
      setUserList(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle toggle status (isActive)
  const handleToggleStatus = async (id) => {
    const user = userList.find(u => u.id === id);
    if (!user) return;
    const nextActive = !user.isActive;

    setActionError('');
    setTogglingId(id);
    try {
      await api.put(`/pengguna/${id}`, { isActive: nextActive });
      setUserList(prev => prev.map(u => (u.id === id ? { ...u, isActive: nextActive } : u)));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal mengubah status pengguna.');
    } finally {
      setTogglingId(null);
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingId) {
        const payload = {
          email: formData.email,
          role: formData.role,
          nama: formData.nama,
          noTelepon: formData.noTelepon,
          alamat: formData.alamat,
          ...(formData.role === 'GURU' && { nip: formData.nip }),
        };

        const res = await api.put(`/pengguna/${editingId}`, payload);

        if (formData.password) {
          await api.put(`/pengguna/${editingId}/reset-password`, { newPassword: formData.password });
        }

        const updated = res.data?.data;
        setUserList(prev => prev.map(u => (u.id === editingId ? (updated || { ...u, ...payload }) : u)));
      } else {
        const res = await api.post('/pengguna', formData);
        const created = res.data?.data;
        if (created) {
          setUserList(prev => [created, ...prev]);
        } else {
          await refetch();
        }
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan pengguna.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleMap = {
      ADMIN: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Shield },
      GURU: { bg: 'bg-green-100', text: 'text-green-800', icon: User },
      ORANGTUA: { bg: 'bg-amber-100', text: 'text-amber-800', icon: UserRound },
    };
    const roleInfo = roleMap[role] || roleMap.GURU;
    const Icon = roleInfo.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleInfo.bg} ${roleInfo.text}`}>
        <Icon className="w-3 h-3" />
        {ROLE_LABEL[role] || role}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    const statusInfo = isActive
      ? { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle, label: 'Aktif' }
      : { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Nonaktif' };
    const Icon = statusInfo.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-blue-600" />
              Kelola Pengguna
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Kelola akun pengguna sistem sekolah
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Pengguna
            </button>
            <button
              onClick={refetch}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {(error || actionError) && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {actionError || 'Gagal memuat data pengguna.'}
          </div>
        )}

        {/* Statistik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, email, atau role..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); resetFilterDependentPage(); }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedRole}
                onChange={(e) => { setSelectedRole(e.target.value); resetFilterDependentPage(); }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="semua">Semua Role</option>
                <option value="ADMIN">Admin</option>
                <option value="GURU">Guru</option>
                <option value="ORANGTUA">Orang Tua</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); resetFilterDependentPage(); }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Pengguna */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Telp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Daftar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-400">
                      Memuat data pengguna…
                    </td>
                  </tr>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                            user.role === 'ADMIN' ? 'bg-purple-500' : user.role === 'GURU' ? 'bg-green-500' : 'bg-amber-500'
                          }`}>
                            {getNama(user).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {getNama(user)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {getNoTelp(user)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatTanggal(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={togglingId === user.id}
                            className={`p-1.5 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              user.isActive
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                            title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingId === user.id}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500 font-medium">Tidak ada data pengguna</p>
                        <p className="text-gray-400 text-sm">Coba ubah filter atau pencarian Anda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Tabel */}
          <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 gap-2">
            <p className="text-sm text-gray-600">
              Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    p === currentPage
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit Pengguna */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {editingId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingId}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Masukkan username"
                />
                {editingId && (
                  <p className="mt-1 text-xs text-gray-500">Username tidak bisa diubah setelah dibuat.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required={formData.role !== 'ADMIN'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password {!editingId && <span className="text-red-500">*</span>}
                  {editingId && <span className="text-xs text-gray-500"> (Kosongkan jika tidak diubah)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingId}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                    placeholder={editingId ? 'Masukkan password baru' : 'Masukkan password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingId}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="GURU">Guru</option>
                    <option value="ORANGTUA">Orang Tua</option>
                  </select>
                  {editingId && (
                    <p className="mt-1 text-xs text-gray-500">Ubah role lewat proses terpisah, tidak lewat form ini.</p>
                  )}
                </div>
                {formData.role === 'GURU' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      NIP
                    </label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Masukkan NIP"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Masukkan alamat"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  {submitting ? 'Menyimpan…' : editingId ? 'Update Pengguna' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS untuk animasi */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default KelolaPengguna;