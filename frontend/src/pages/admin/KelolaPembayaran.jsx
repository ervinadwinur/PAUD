import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Printer,
  Plus,
  AlertCircle,
  Check,
  RefreshCw,
  MessageCircle,
  Wallet,
  User,
  X,
  Users,
  Receipt
} from 'lucide-react';
import api from '../../services/api';
import { useSiswaList } from '../../hooks/useSiswaList';

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const STATUS_INFO = {
  LUNAS: { label: 'Lunas', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  MENUNGGU_VERIFIKASI: { label: 'Menunggu Verifikasi', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  BELUM_BAYAR: { label: 'Belum Bayar', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  DITOLAK: { label: 'Ditolak', bg: 'bg-gray-200', text: 'text-gray-700', icon: XCircle },
};

const EMPTY_TAGIHAN = {
  siswaId: '',
  bulan: String(new Date().getMonth() + 1),
  tahun: String(new Date().getFullYear()),
  jumlah: ''
};

function fileUrl(path) {
  if (!path) return null;
  const base = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
  return `${base}${path}`;
}

const KelolaPembayaran = () => {
  const { siswaList, loading: loadingSiswa } = useSiswaList();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  // Pencarian khusus untuk section Daftar Siswa
  const [siswaSearchTerm, setSiswaSearchTerm] = useState('');

  const [processingId, setProcessingId] = useState(null);

  const [isTagihanModalOpen, setIsTagihanModalOpen] = useState(false);
  const [tagihanForm, setTagihanForm] = useState(EMPTY_TAGIHAN);
  const [tagihanError, setTagihanError] = useState('');
  const [savingTagihan, setSavingTagihan] = useState(false);
  // Jika dibuka dari baris "Daftar Siswa", siswa ini dikunci (tidak lewat dropdown)
  const [lockedSiswa, setLockedSiswa] = useState(null);

  const fetchPayments = () => {
    setLoading(true);
    setError('');
    api
      .get('/pembayaran')
      .then((res) => setPayments(res.data.data || []))
      .catch(() => setError('Gagal memuat data pembayaran.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchPayments, []);

  // Statistik pembayaran
  const stats = [
    { label: 'Total Tagihan', value: payments.length, icon: User, color: 'bg-blue-50 text-blue-600' },
    { label: 'Lunas', value: payments.filter(p => p.status === 'LUNAS').length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Menunggu Verifikasi', value: payments.filter(p => p.status === 'MENUNGGU_VERIFIKASI').length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Belum Bayar', value: payments.filter(p => p.status === 'BELUM_BAYAR').length, icon: XCircle, color: 'bg-red-50 text-red-600' }
  ];

  // Filter pembayaran
  const filteredPayments = payments.filter(payment => {
    const nama = payment.siswa?.nama || '';
    const nis = payment.siswa?.nis || '';
    const kelas = payment.siswa?.kelas?.nama || '';
    const matchSearch = nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'semua' || payment.status === selectedStatus;
    const matchMonth = String(payment.bulan) === selectedMonth;
    const matchYear = String(payment.tahun) === selectedYear;
    return matchSearch && matchStatus && matchMonth && matchYear;
  });

  // Filter daftar siswa
  const filteredSiswa = useMemo(() => {
    const term = siswaSearchTerm.toLowerCase();
    return siswaList.filter((s) => {
      const nama = s.nama || '';
      const nis = s.nis || '';
      const kelas = s.kelas?.nama || '';
      return (
        nama.toLowerCase().includes(term) ||
        nis.toLowerCase().includes(term) ||
        kelas.toLowerCase().includes(term)
      );
    });
  }, [siswaList, siswaSearchTerm]);

  const getStatusBadge = (status) => {
    const info = STATUS_INFO[status] || STATUS_INFO.BELUM_BAYAR;
    const Icon = info.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${info.bg} ${info.text}`}>
        <Icon className="w-3 h-3" />
        {info.label}
      </span>
    );
  };

  // Verifikasi (LUNAS)
  const handleVerifyPayment = async (id) => {
    setActionError('');
    setProcessingId(id);
    try {
      const res = await api.put(`/pembayaran/${id}/verifikasi`, { status: 'LUNAS' });
      const updated = res.data?.data;
      setPayments(prev => prev.map(p => (p.id === id ? { ...p, ...(updated || { status: 'LUNAS' }) } : p)));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal memverifikasi pembayaran.');
    } finally {
      setProcessingId(null);
    }
  };

  // Tolak (DITOLAK)
  const handleRejectPayment = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menolak pembayaran ini?')) return;

    setActionError('');
    setProcessingId(id);
    try {
      const res = await api.put(`/pembayaran/${id}/verifikasi`, { status: 'DITOLAK' });
      const updated = res.data?.data;
      setPayments(prev => prev.map(p => (p.id === id ? { ...p, ...(updated || { status: 'DITOLAK' }) } : p)));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal menolak pembayaran.');
    } finally {
      setProcessingId(null);
    }
  };

  // Kirim pengingat WhatsApp
  const handleSendReminder = async (id) => {
    setActionError('');
    setProcessingId(id);
    try {
      const res = await api.post(`/pembayaran/${id}/pengingat-wa`);
      const { whatsappUrl } = res.data.data;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal membuat pengingat WhatsApp.');
    } finally {
      setProcessingId(null);
    }
  };

  // Buka modal tambah tagihan.
  // Jika dipanggil dengan objek siswa (dari klik baris di Daftar Siswa),
  // field siswa langsung terkunci ke siswa tersebut.
  const handleOpenTagihanModal = (siswa = null) => {
    if (siswa) {
      setTagihanForm({ ...EMPTY_TAGIHAN, siswaId: String(siswa.id) });
      setLockedSiswa(siswa);
    } else {
      setTagihanForm(EMPTY_TAGIHAN);
      setLockedSiswa(null);
    }
    setTagihanError('');
    setIsTagihanModalOpen(true);
  };

  const handleTagihanInputChange = (e) => {
    const { name, value } = e.target;
    setTagihanForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTagihan = async (e) => {
    e.preventDefault();
    setTagihanError('');

    if (!tagihanForm.siswaId) {
      setTagihanError('Pilih siswa terlebih dahulu.');
      return;
    }
    if (!tagihanForm.jumlah || Number(tagihanForm.jumlah) <= 0) {
      setTagihanError('Nominal tagihan harus lebih dari 0.');
      return;
    }

    setSavingTagihan(true);
    try {
      const res = await api.post('/pembayaran/tagihan', {
        siswaId: Number(tagihanForm.siswaId),
        bulan: Number(tagihanForm.bulan),
        tahun: Number(tagihanForm.tahun),
        jumlah: Number(tagihanForm.jumlah),
      });
      const created = res.data?.data;
      if (created) {
        setPayments(prev => [created, ...prev]);
      } else {
        fetchPayments();
      }
      setIsTagihanModalOpen(false);
      setLockedSiswa(null);
    } catch (err) {
      setTagihanError(err.response?.data?.message || 'Gagal membuat tagihan. Pastikan siswa belum punya tagihan di bulan/tahun yang sama.');
    } finally {
      setSavingTagihan(false);
    }
  };

  // Format nominal ke Rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const totalPendapatan = payments.filter(p => p.status === 'LUNAS').reduce((sum, p) => sum + p.jumlah, 0);
  const totalTarget = payments.reduce((sum, p) => sum + p.jumlah, 0);
  const persenLunas = payments.length ? Math.round((payments.filter(p => p.status === 'LUNAS').length / payments.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
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
          <button
            onClick={() => handleOpenTagihanModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Tagihan
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {(error || actionError) && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {actionError || error}
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
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

      {/* ===== Section: Daftar Siswa ===== */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Daftar Siswa
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={siswaSearchTerm}
              onChange={(e) => setSiswaSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingSiswa ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-400">
                    Memuat daftar siswa…
                  </td>
                </tr>
              ) : filteredSiswa.length > 0 ? (
                filteredSiswa.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {(siswa.nama || '?').charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{siswa.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{siswa.nis || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{siswa.kelas?.nama || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenTagihanModal(siswa)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs font-medium flex items-center gap-1.5"
                        title="Tambah tagihan untuk siswa ini"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Tambah Tagihan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-10 h-10 text-gray-300" />
                      <p className="text-gray-500 font-medium">Tidak ada data siswa</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter dan Pencarian (Tabel Pembayaran) */}
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
              <option value="LUNAS">Lunas</option>
              <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
              <option value="BELUM_BAYAR">Belum Bayar</option>
              <option value="DITOLAK">Ditolak</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {BULAN_LIST.map((month, i) => (
                <option key={month} value={String(i + 1)}>{month}</option>
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Upload Bukti</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-400">
                    Memuat data pembayaran…
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {(payment.siswa?.nama || '?').charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {payment.siswa?.nama || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{payment.siswa?.nis || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{payment.siswa?.kelas?.nama || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{formatRupiah(payment.jumlah)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {payment.tanggalUpload ? new Date(payment.tanggalUpload).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{payment.metode || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {payment.status === 'MENUNGGU_VERIFIKASI' && (
                          <>
                            <button
                              onClick={() => handleVerifyPayment(payment.id)}
                              disabled={processingId === payment.id}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-60"
                              title="Verifikasi"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              disabled={processingId === payment.id}
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-60"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {payment.buktiUrl && (
                          <a
                            href={fileUrl(payment.buktiUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Lihat Bukti"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        {payment.status !== 'LUNAS' && (
                          <button
                            onClick={() => handleSendReminder(payment.id)}
                            disabled={processingId === payment.id}
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition disabled:opacity-60"
                            title="Kirim Pengingat WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
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

        <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredPayments.length} dari {payments.length} data
          </p>
        </div>
      </div>

      {/* Ringkasan Pembayaran */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Pendapatan</h3>
          <p className="text-2xl font-bold text-blue-600">{formatRupiah(totalPendapatan)}</p>
          <p className="text-xs text-gray-500 mt-1">Dari {payments.filter(p => p.status === 'LUNAS').length} tagihan lunas</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Target Pembayaran</h3>
          <p className="text-2xl font-bold text-gray-800">{formatRupiah(totalTarget)}</p>
          <p className="text-xs text-gray-500 mt-1">Dari {payments.length} tagihan</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Persentase Lunas</h3>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-green-600">{persenLunas}%</p>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${persenLunas}%` }} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Tingkat pembayaran SPP</p>
        </div>
      </div>

      {/* Modal Tambah Tagihan */}
      {isTagihanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setIsTagihanModalOpen(false); setLockedSiswa(null); } }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Tambah Tagihan SPP
              </h2>
              <button
                onClick={() => { setIsTagihanModalOpen(false); setLockedSiswa(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitTagihan} className="p-6 space-y-4">
              {tagihanError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {tagihanError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Siswa <span className="text-red-500">*</span>
                </label>

                {lockedSiswa ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                      {(lockedSiswa.nama || '?').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{lockedSiswa.nama}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {lockedSiswa.nis || '-'}{lockedSiswa.kelas?.nama ? ` • ${lockedSiswa.kelas.nama}` : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      name="siswaId"
                      value={tagihanForm.siswaId}
                      onChange={handleTagihanInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Pilih siswa</option>
                      {siswaList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama}{s.nis ? ` — ${s.nis}` : ''}{s.kelas?.nama ? ` (${s.kelas.nama})` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Tagihan otomatis muncul di akun orang tua siswa ini.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bulan</label>
                  <select
                    name="bulan"
                    value={tagihanForm.bulan}
                    onChange={handleTagihanInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {BULAN_LIST.map((month, i) => (
                      <option key={month} value={String(i + 1)}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tahun</label>
                  <input
                    type="number"
                    name="tahun"
                    value={tagihanForm.tahun}
                    onChange={handleTagihanInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nominal (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={tagihanForm.jumlah}
                  onChange={handleTagihanInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 150000"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIsTagihanModalOpen(false); setLockedSiswa(null); }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingTagihan}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  {savingTagihan ? 'Menyimpan…' : 'Buat Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPembayaran;