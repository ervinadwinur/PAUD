import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronRight,
  Calendar,
  Clock,
  User,
  Megaphone,
  BookOpen,
  Wallet,
  CalendarDays,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  File,
  Download,
  Trash,
  FolderOpen
} from 'lucide-react';

const Pengumuman = () => {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'akademik',
    priority: 'biasa',
    content: '',
    date: '',
    time: '',
    file: null,
    fileName: ''
  });

  // Data pengumuman
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Pendaftaran Peserta Didik Baru 2026/2027',
      category: 'akademik',
      date: '15 Juli 2026',
      time: '08:00 WIB',
      author: 'Admin Sekolah',
      content: 'Diberitahukan kepada seluruh orang tua/wali murid bahwa pendaftaran peserta didik baru tahun ajaran 2026/2027 telah dibuka. Pendaftaran dapat dilakukan secara online melalui website sekolah atau datang langsung ke kantor TU.',
      priority: 'penting',
      fileName: 'Formulir_Pendaftaran_2026.pdf',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Libur Semester Ganjil 2026',
      category: 'akademik',
      date: '20 Desember 2026',
      time: '00:00 WIB',
      author: 'Kepala Sekolah',
      content: 'Berdasarkan kalender akademik, libur semester ganjil akan dilaksanakan pada tanggal 20 Desember 2026 - 3 Januari 2027. Kegiatan belajar mengajar akan dilaksanakan kembali pada tanggal 4 Januari 2027.',
      priority: 'penting',
      fileName: null,
      fileSize: null
    },
    {
      id: 3,
      title: 'Pembayaran SPP Bulan Juli 2026',
      category: 'keuangan',
      date: '1 Juli 2026',
      time: '00:00 WIB',
      author: 'Bendahara Sekolah',
      content: 'Kepada seluruh orang tua/wali murid, pembayaran SPP bulan Juli 2026 dapat dilakukan mulai tanggal 1 - 10 Juli 2026. Pembayaran dapat dilakukan melalui bank BNI, Mandiri, atau melalui aplikasi pembayaran sekolah.',
      priority: 'penting',
      fileName: 'Petunjuk_Pembayaran_SPP.pdf',
      fileSize: '1.8 MB'
    },
    {
      id: 4,
      title: 'Lomba Cerdas Cermat Antar Kelas',
      category: 'event',
      date: '25 Agustus 2026',
      time: '09:00 WIB',
      author: 'Panitia Lomba',
      content: 'Dalam rangka memperingati Hari Kemerdekaan, akan diadakan lomba cerdas cermat antar kelas. Pendaftaran dibuka hingga tanggal 20 Agustus 2026. Setiap kelas wajib mengirimkan 1 tim terdiri dari 3 siswa.',
      priority: 'biasa',
      fileName: null,
      fileSize: null
    },
    {
      id: 5,
      title: 'Rapat Orang Tua/Wali Murid Semester Genap',
      category: 'event',
      date: '10 Januari 2027',
      time: '13:00 WIB',
      author: 'Wakil Kepala Sekolah',
      content: 'Dengan hormat, kami mengundang seluruh orang tua/wali murid untuk menghadiri rapat orang tua/wali murid semester genap yang akan dilaksanakan pada tanggal 10 Januari 2027 pukul 13.00 WIB di Aula Sekolah. Mohon hadir tepat waktu.',
      priority: 'biasa',
      fileName: null,
      fileSize: null
    },
    {
      id: 6,
      title: 'Perubahan Jadwal Pelajaran',
      category: 'akademik',
      date: '5 Agustus 2026',
      time: '07:00 WIB',
      author: 'Wakil Kepala Sekolah Bidang Kurikulum',
      content: 'Diberitahukan kepada seluruh siswa dan guru bahwa akan ada perubahan jadwal pelajaran mulai tanggal 7 Agustus 2026. Silakan cek jadwal terbaru di papan pengumuman atau website sekolah.',
      priority: 'biasa',
      fileName: 'Jadwal_Pelajaran_Terbaru.pdf',
      fileSize: '3.2 MB'
    }
  ]);

  // Filter pengumuman berdasarkan kategori
  const filteredAnnouncements = announcements.filter(item => {
    const matchCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Fungsi untuk mendapatkan warna badge kategori
  const getCategoryBadge = (category) => {
    const colors = {
      akademik: 'bg-blue-100 text-blue-800',
      keuangan: 'bg-green-100 text-green-800',
      event: 'bg-purple-100 text-purple-800',
      umum: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.umum;
  };

  // Fungsi untuk mendapatkan warna badge prioritas
  const getPriorityBadge = (priority) => {
    const colors = {
      penting: 'bg-red-100 text-red-800',
      biasa: 'bg-yellow-100 text-yellow-800'
    };
    return colors[priority] || colors.biasa;
  };

  // Statistik pengumuman
  const stats = [
    { label: 'Total Pengumuman', value: announcements.length, icon: Megaphone, color: 'bg-blue-50 text-blue-600' },
    { label: 'Akademik', value: announcements.filter(a => a.category === 'akademik').length, icon: BookOpen, color: 'bg-green-50 text-green-600' },
    { label: 'Keuangan', value: announcements.filter(a => a.category === 'keuangan').length, icon: Wallet, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Event', value: announcements.filter(a => a.category === 'event').length, icon: CalendarDays, color: 'bg-purple-50 text-purple-600' }
  ];

  // Handle tambah pengumuman
  const handleAddAnnouncement = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFilePreview(null);
    setFormData({
      title: '',
      category: 'akademik',
      priority: 'biasa',
      content: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      file: null,
      fileName: ''
    });
    setIsModalOpen(true);
  };

  // Handle edit pengumuman
  const handleEditAnnouncement = (id) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setEditingId(id);
      setSelectedFile(null);
      setFilePreview(null);
      setFormData({
        title: announcement.title,
        category: announcement.category,
        priority: announcement.priority,
        content: announcement.content,
        date: announcement.date,
        time: announcement.time,
        file: null,
        fileName: announcement.fileName || ''
      });
      setIsModalOpen(true);
    }
  };

  // Handle delete pengumuman
  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  // Handle file upload - DIPERBAIKI
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file PDF
      if (file.type !== 'application/pdf') {
        alert('Hanya file PDF yang diperbolehkan!');
        e.target.value = ''; // Reset input
        return;
      }
      
      // Validasi ukuran file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB!');
        e.target.value = ''; // Reset input
        return;
      }

      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }
    // Reset input agar bisa upload file yang sama lagi
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Hanya file PDF yang diperbolehkan!');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB!');
        return;
      }

      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }
  };

  // Handle remove file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFormData(prev => ({
      ...prev,
      file: null,
      fileName: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input - DIPERBAIKI
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Edit existing
      setAnnouncements(announcements.map(a => 
        a.id === editingId 
          ? { 
              ...a, 
              ...formData,
              author: a.author,
              fileName: formData.fileName || a.fileName,
              fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : a.fileSize
            } 
          : a
      ));
    } else {
      // Add new
      const newAnnouncement = {
        id: announcements.length + 1,
        ...formData,
        author: 'Admin Sekolah',
        fileName: formData.fileName || null,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : null
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedFile(null);
    setFilePreview(null);
    setFormData({
      title: '',
      category: 'akademik',
      priority: 'biasa',
      content: '',
      date: '',
      time: '',
      file: null,
      fileName: ''
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle download file
  const handleDownloadFile = (fileName) => {
    alert(`Mengunduh file: ${fileName}`);
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📢 Pengumuman
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Informasi dan pengumuman terbaru dari sekolah
          </p>
        </div>
        <button 
          onClick={handleAddAnnouncement}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </button>
      </div>

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

      {/* Filter dan Pencarian */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {['semua', 'akademik', 'keuangan', 'event', 'umum'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'semua' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Daftar Pengumuman */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${
                announcement.priority === 'penting' ? 'border-red-500' : 'border-blue-500'
              } hover:shadow-md transition`}
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {announcement.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryBadge(announcement.category)}`}>
                      {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityBadge(announcement.priority)}`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {announcement.date}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {announcement.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditAnnouncement(announcement.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {announcement.content}
              </p>

              {/* Tampilkan file jika ada */}
              {announcement.fileName && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{announcement.fileName}</p>
                        <p className="text-xs text-gray-500">{announcement.fileSize}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadFile(announcement.fileName)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
                    {announcement.author.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {announcement.author}
                  </span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  Baca Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada pengumuman</h3>
            <p className="text-gray-600 text-sm">
              Tidak ditemukan pengumuman yang sesuai dengan filter atau pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit Pengumuman dengan Upload PDF - DIPERBAIKI */}
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
                <Megaphone className="w-5 h-5 text-blue-600" />
                {editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Judul Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Masukkan judul pengumuman"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="akademik">Akademik</option>
                    <option value="keuangan">Keuangan</option>
                    <option value="event">Event</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="biasa">Biasa</option>
                    <option value="penting">Penting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Waktu
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Isi Pengumuman <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Masukkan isi pengumuman"
                />
              </div>

              {/* Upload PDF - DIPERBAIKI */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Upload File PDF (Opsional)
                </label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Klik untuk upload
                      </span>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {/* Preview file */}
                {selectedFile && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {formData.fileName && !selectedFile && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{formData.fileName}</p>
                        <p className="text-xs text-gray-500">File sudah diupload sebelumnya</p>
                      </div>
                    </div>
                  </div>
                )}
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
                  {editingId ? 'Update Pengumuman' : 'Simpan Pengumuman'}
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

export default Pengumuman;