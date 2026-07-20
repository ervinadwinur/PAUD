import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Laporan = () => {
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2026");

  // Data statistik
  const stats = [
    {
      title: "Total Siswa",
      value: "1,248",
      icon: "👨‍🎓",
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      title: "Total Guru",
      value: "64",
      icon: "👨‍🏫",
      color: "bg-green-500",
      trend: "+3%",
    },
    {
      title: "Rata-rata Kehadiran",
      value: "94.7%",
      icon: "📊",
      color: "bg-purple-500",
      trend: "+2.1%",
    },
    {
      title: "Total Kelas",
      value: "32",
      icon: "📚",
      color: "bg-orange-500",
      trend: "0%",
    },
  ];

  // Data grafik kehadiran
  const attendanceData = [
    { name: "Senin", Hadir: 85, Sakit: 8, Izin: 5, Alpha: 2 },
    { name: "Selasa", Hadir: 82, Sakit: 10, Izin: 6, Alpha: 2 },
    { name: "Rabu", Hadir: 88, Sakit: 6, Izin: 4, Alpha: 2 },
    { name: "Kamis", Hadir: 79, Sakit: 12, Izin: 7, Alpha: 2 },
    { name: "Jumat", Hadir: 90, Sakit: 5, Izin: 3, Alpha: 2 },
  ];

  // Data grafik prestasi per kelas
  const classPerformance = [
    { name: "Kelinci", RataRata: 85, Tertinggi: 98, Terendah: 70 },
    { name: "Lebah", RataRata: 82, Tertinggi: 95, Terendah: 68 },
    { name: "Kupu-Kupu", RataRata: 88, Tertinggi: 99, Terendah: 72 },
    { name: "Ular", RataRata: 80, Tertinggi: 93, Terendah: 65 },
    { name: "Elang", RataRata: 86, Tertinggi: 97, Terendah: 71 },
    { name: "Harimau", RataRata: 83, Tertinggi: 94, Terendah: 69 },
  ];

  // Data rekap laporan guru
  const teacherReports = [
    {
      id: 1,
      nama: "Dr. Ahmad Suryadi, M.Pd.",
      kelas: "Kelinci",
      kehadiran: "95%",
      prestasi: "A",
      tugas: 12,
    },
    {
      id: 2,
      nama: "Drs. Budi Santoso",
      kelas: "Kupu-Kupu",
      kehadiran: "88%",
      prestasi: "B+",
      tugas: 10,
    },
    {
      id: 3,
      nama: "Siti Rahmawati, S.Pd.",
      kelas: "Lebah",
      kehadiran: "92%",
      prestasi: "A-",
      tugas: 14,
    },
    {
      id: 4,
      nama: "Drs. H. Muhammad Ali",
      kelas: "Ular",
      kehadiran: "97%",
      prestasi: "A",
      tugas: 8,
    },
    {
      id: 5,
      nama: "Nina Kusuma, S.Si.",
      kelas: "Elang",
      kehadiran: "85%",
      prestasi: "B",
      tugas: 11,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const prestasiData = [
    { name: "A", value: 15 },
    { name: "B+", value: 10 },
    { name: "B", value: 8 },
    { name: "C", value: 5 },
  ];

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📊 Dashboard Laporan
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Rekap data dan laporan akademik sekolah
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {["Januari", "Februari", "Maret", "April", "Mei", "Juni"].map(
              (month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              )
            )}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {["2024", "2025", "2026"].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {stat.title}
                </p>
                <p className="text-xl font-bold mt-1 text-gray-800">
                  {stat.value}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </span>
              </div>
              <div
                className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Grafik Kehadiran */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">
            📈 Grafik Kehadiran Siswa
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Hadir" fill="#4CAF50" />
                <Bar dataKey="Sakit" fill="#FFC107" />
                <Bar dataKey="Izin" fill="#2196F3" />
                <Bar dataKey="Alpha" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Prestasi */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">
            🎯 Prestasi Akademik per Kelas
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="RataRata" fill="#3F51B5" />
                <Bar dataKey="Tertinggi" fill="#4CAF50" />
                <Bar dataKey="Terendah" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie Chart dan Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">
            🍩 Distribusi Prestasi
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prestasiData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prestasiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">
            📋 Ringkasan Laporan
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Total Tugas Dikumpulkan</p>
              <p className="text-xl font-bold text-blue-600">347</p>
              <p className="text-xs text-gray-500">dari 400 siswa</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Rata-rata Nilai</p>
              <p className="text-xl font-bold text-green-600">84.5</p>
              <p className="text-xs text-gray-500">meningkat 2%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Siswa Berprestasi</p>
              <p className="text-xl font-bold text-purple-600">38</p>
              <p className="text-xs text-gray-500">nilai A ke atas</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Kegiatan Ekstrakurikuler</p>
              <p className="text-xl font-bold text-orange-600">12</p>
              <p className="text-xs text-gray-500">aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Rekap Guru */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
          <h2 className="text-sm font-semibold text-gray-800">
            📝 Rekap Laporan Guru
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari guru..."
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200 transition">
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Guru
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kehadiran
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prestasi
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tugas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teacherReports.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs flex-shrink-0">
                        {teacher.nama.charAt(0)}
                      </div>
                      <span className="ml-2 text-gray-900 truncate max-w-[150px]">
                        {teacher.nama}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {teacher.mapel}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {teacher.kelas}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseInt(teacher.kehadiran) >= 90
                          ? "bg-green-100 text-green-800"
                          : parseInt(teacher.kehadiran) >= 80
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {teacher.kehadiran}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">
                      {teacher.prestasi}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {teacher.tugas}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-2">
                      Detail
                    </button>
                    <button className="text-green-600 hover:text-green-800 font-medium text-xs">
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
          <p className="text-xs text-gray-600">
            Menampilkan 5 dari 64 guru
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;