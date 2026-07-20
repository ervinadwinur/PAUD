import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Printer,
  ChevronDown,
  Calendar,
  User,
  FileText,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react';

const KelolaPembayaran = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedMonth, setSelectedMonth] = useState('Juli 2026');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Data pembayaran siswa
  const [payments, setPayments] = useState([
    {
      id: 1,
      nama: 'Ahmad Fauzi',
      nis: '2024001',
      kelas: '10-A',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '01-07-2026',
      metode: 'Transfer Bank',
      status: 'lunas',
      bukti: 'bukti_pembayaran_1.jpg',
      catatan: '-'
    },
    {
      id: 2,
      nama: 'Siti Rahmadani',
      nis: '2024002',
      kelas: '10-B',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '03-07-2026',
      metode: 'Tunai',
      status: 'lunas',
      bukti: 'bukti_pembayaran_2.jpg',
      catatan: '-'
    },
    {
      id: 3,
      nama: 'Budi Santoso',
      nis: '2024003',
      kelas: '11-A',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '05-07-2026',
      metode: 'Transfer Bank',
      status: 'pending',
      bukti: 'bukti_pembayaran_3.jpg',
      catatan: 'Menunggu verifikasi admin'
    },
    {
      id: 4,
      nama: 'Dewi Lestari',
      nis: '2024004',
      kelas: '11-B',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: null,
      metode: '-',
      status: 'belum_bayar',
      bukti: null,
      catatan: '-'
    },
    {
      id: 5,
      nama: 'Rizky Ramadhan',
      nis: '2024005',
      kelas: '12-A',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '02-07-2026',
      metode: 'QRIS',
      status: 'lunas',
      bukti: 'bukti_pembayaran_5.jpg',
      catatan: '-'
    },
    {
      id: 6,
      nama: 'Putri Amelia',
      nis: '2024006',
      kelas: '12-B',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '07-07-2026',
      metode: 'Transfer Bank',
      status: 'pending',
      bukti: 'bukti_pembayaran_6.jpg',
      catatan: 'Bukti kurang jelas'
    },
    {
      id: 7,
      nama: 'Muhammad Ilham',
      nis: '2024007',
      kelas: '10-A',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: null,
      metode: '-',
      status: 'belum_bayar',
      bukti: null,
      catatan: '-'
    },
    {
      id: 8,
      nama: 'Nadia Putri',
      nis: '2024008',
      kelas: '10-B',
      bulan: 'Juli 2026',
      nominal: 150000,
      tanggalBayar: '08-07-2026',
      metode: 'Tunai',
      status: 'lunas',
      bukti: 'bukti_pembayaran_8.jpg',
      catatan: '-'
    }
  ]);

  // Statistik pembayaran
  const stats = [
    { 
      label: 'Total Siswa', 
      value: payments.length, 
      icon: User, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      label: 'Lunas', 
      value: payments.filter(p => p.status === 'lunas').length, 
      icon: CheckCircle, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Pending', 
      value: payments.filter(p => p.status === 'pending').length, 
      icon: Clock, 
      color: 'bg-yellow-50 text-yellow-600' 
    },
    { 
      label: 'Belum Bayar', 
      value: payments.filter(p => p.status === 'belum_bayar').length, 
      icon: XCircle, 
      color: 'bg-red-50 text-red-600' 
    }
  ];

  // Filter pembayaran
  const filteredPayments = payments.filter(payment => {
    const matchSearch = payment.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       payment.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       payment.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'semua' || payment.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Fungsi untuk mendapatkan badge status
  const getStatusBadge = (status) => {
    const statusMap = {
      lunas: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      belum_bayar: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const statusInfo = statusMap[status] || statusMap.belum_bayar;
    const Icon = statusInfo.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
        <Icon className="w-3 h-3" />
        {status === 'lunas' ? 'Lunas' : status === 'pending' ? 'Pending' : 'Belum Bayar'}
      </span>
    );
  };

  // Handle verifikasi pembayaran
  const handleVerifyPayment = (id) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: 'lunas', catatan: 'Terverifikasi' } : p
    ));
  };

  // Handle tolak pembayaran
  const handleRejectPayment = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menolak pembayaran ini?')) {
      setPayments(payments.map(p => 
        p.id === id ? { ...p, status: 'belum_bayar', catatan: 'Pembayaran ditolak' } : p
      ));
    }
  };

  // Format nominal ke Rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Wallet className="w-7 h-7 text-blue-600" />
              Verifikasi Pembayaran SPP
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Kelola dan verifikasi pembayaran SPP siswa
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Cetak
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2">
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
                placeholder="Cari nama, NIS, atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="pending">Pending</option>
                <option value="belum_bayar">Belum Bayar</option>
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['2024', '2025', '2026', '2027'].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Pembayaran */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Siswa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tgl Bayar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                            {payment.nama.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {payment.nama}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {payment.nis}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {payment.kelas}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                        {formatRupiah(payment.nominal)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {payment.tanggalBayar || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {payment.metode}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                                title="Verifikasi"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment.id)}
                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                title="Tolak"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {payment.bukti && (
                            <button
                              className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                              title="Lihat Bukti"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                            title="Detail"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500 font-medium">Tidak ada data pembayaran</p>
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
              Menampilkan {filteredPayments.length} dari {payments.length} data
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

        {/* Ringkasan Pembayaran */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Pendapatan</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatRupiah(payments.filter(p => p.status === 'lunas').reduce((sum, p) => sum + p.nominal, 0))}
            </p>
            <p className="text-xs text-gray-500 mt-1">Dari {payments.filter(p => p.status === 'lunas').length} siswa</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Target Pembayaran</h3>
            <p className="text-2xl font-bold text-gray-800">
              {formatRupiah(payments.reduce((sum, p) => sum + p.nominal, 0))}
            </p>
            <p className="text-xs text-gray-500 mt-1">Dari {payments.length} siswa</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tingkat Pembayaran</h3>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((payments.filter(p => p.status === 'lunas').length / payments.length) * 100)}%
              </p>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(payments.filter(p => p.status === 'lunas').length / payments.length) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Tingkat pembayaran SPP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaPembayaran;