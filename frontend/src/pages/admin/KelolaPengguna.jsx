import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  User,
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

const KelolaPengguna = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'guru',
    status: 'aktif',
    noTelp: '',
    alamat: ''
  });

  // Data pengguna
  const [users, setUsers] = useState([
    {
      id: 1,
      nama: 'Dr. Ahmad Suryadi, M.Pd.',
      email: 'ahmad.suryadi@sekolah.com',
      role: 'admin',
      status: 'aktif',
      noTelp: '081234567890',
      alamat: 'Jl. Pendidikan No. 123, Jakarta',
      tanggalDaftar: '01-01-2024',
      lastLogin: '15-07-2026 08:30'
    },
    {
      id: 2,
      nama: 'Drs. Budi Santoso',
      email: 'budi.santoso@sekolah.com',
      role: 'guru',
      status: 'aktif',
      noTelp: '081234567891',
      alamat: 'Jl. Guru No. 45, Bandung',
      tanggalDaftar: '15-01-2024',
      lastLogin: '14-07-2026 15:20'
    },
    {
      id: 3,
      nama: 'Siti Rahmawati, S.Pd.',
      email: 'siti.rahmawati@sekolah.com',
      role: 'guru',
      status: 'aktif',
      noTelp: '081234567892',
      alamat: 'Jl. Mawar No. 7, Surabaya',
      tanggalDaftar: '20-01-2024',
      lastLogin: '15-07-2026 07:45'
    },
    {
      id: 4,
      nama: 'Drs. H. Muhammad Ali',
      email: 'muhammad.ali@sekolah.com',
      role: 'guru',
      status: 'nonaktif',
      noTelp: '081234567893',
      alamat: 'Jl. Agama No. 9, Semarang',
      tanggalDaftar: '10-02-2024',
      lastLogin: '10-07-2026 09:00'
    },
    {
      id: 5,
      nama: 'Nina Kusuma, S.Si.',
      email: 'nina.kusuma@sekolah.com',
      role: 'guru',
      status: 'aktif',
      noTelp: '081234567894',
      alamat: 'Jl. Sains No. 15, Yogyakarta',
      tanggalDaftar: '25-02-2024',
      lastLogin: '15-07-2026 10:15'
    },
    {
      id: 6,
      nama: 'Rina Wati, S.Kom.',
      email: 'rina.wati@sekolah.com',
      role: 'admin',
      status: 'aktif',
      noTelp: '081234567895',
      alamat: 'Jl. Teknologi No. 20, Malang',
      tanggalDaftar: '01-03-2024',
      lastLogin: '15-07-2026 11:30'
    },
    {
      id: 7,
      nama: 'Fajar Pratama, S.Pd.',
      email: 'fajar.pratama@sekolah.com',
      role: 'guru',
      status: 'aktif',
      noTelp: '081234567896',
      alamat: 'Jl. Olahraga No. 10, Medan',
      tanggalDaftar: '05-03-2024',
      lastLogin: '14-07-2026 13:45'
    }
  ]);

  // Statistik pengguna
  const stats = [
    { 
      label: 'Total Pengguna', 
      value: users.length, 
      icon: Users, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      label: 'Admin', 
      value: users.filter(u => u.role === 'admin').length, 
      icon: Shield, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      label: 'Guru', 
      value: users.filter(u => u.role === 'guru').length, 
      icon: User, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Aktif', 
      value: users.filter(u => u.status === 'aktif').length, 
      icon: UserCheck, 
      color: 'bg-emerald-50 text-emerald-600' 
    }
  ];

  // Filter pengguna
  const filteredUsers = users.filter(user => {
    const matchSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'semua' || user.role === selectedRole;
    const matchStatus = selectedStatus === 'semua' || user.status === selectedStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Handle tambah pengguna
  const handleAddUser = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      email: '',
      password: '',
      role: 'guru',
      status: 'aktif',
      noTelp: '',
      alamat: ''
    });
    setIsModalOpen(true);
  };

  // Handle edit pengguna
  const handleEditUser = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingId(id);
      setFormData({
        nama: user.nama,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
        noTelp: user.noTelp,
        alamat: user.alamat
      });
      setIsModalOpen(true);
    }
  };

  // Handle delete pengguna
  const handleDeleteUser = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'aktif' ? 'nonaktif' : 'aktif' } : u
    ));
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Edit existing
      setUsers(users.map(u => 
        u.id === editingId 
          ? { 
              ...u, 
              ...formData,
              password: formData.password || u.password
            } 
          : u
      ));
    } else {
      // Add new
      const newUser = {
        id: users.length + 1,
        ...formData,
        tanggalDaftar: new Date().toLocaleDateString('id-ID'),
        lastLogin: '-'
      };
      setUsers([newUser, ...users]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      nama: '',
      email: '',
      password: '',
      role: 'guru',
      status: 'aktif',
      noTelp: '',
      alamat: ''
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Shield },
      guru: { bg: 'bg-green-100', text: 'text-green-800', icon: User }
    };
    const roleInfo = roleMap[role] || roleMap.guru;
    const Icon = roleInfo.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleInfo.bg} ${roleInfo.text}`}>
        <Icon className="w-3 h-3" />
        {role === 'admin' ? 'Admin' : 'Guru'}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      aktif: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
      nonaktif: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const statusInfo = statusMap[status] || statusMap.aktif;
    const Icon = statusInfo.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
        <Icon className="w-3 h-3" />
        {status === 'aktif' ? 'Aktif' : 'Nonaktif'}
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
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="semua">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                            user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                          }`}>
                            {user.nama.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {user.nama}
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
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.noTelp}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {user.tanggalDaftar}
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
                            className={`p-1.5 rounded-lg transition ${
                              user.status === 'aktif' 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                            title={user.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {user.status === 'aktif' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
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
              Menampilkan {filteredUsers.length} dari {users.length} pengguna
            </p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="guru">Guru</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="noTelp"
                  value={formData.noTelp}
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
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {editingId ? 'Update Pengguna' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS untuk animasi */}
      <style jsx>{`
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