import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { bulan: "Jan", siswa: 30 },
  { bulan: "Feb", siswa: 35 },
  { bulan: "Mar", siswa: 40 },
  { bulan: "Apr", siswa: 42 },
  { bulan: "Mei", siswa: 45 },
];

const LaporanChart = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Statistik Jumlah Siswa</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="siswa" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LaporanChart;
