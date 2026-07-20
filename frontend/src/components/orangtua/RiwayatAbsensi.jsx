const RiwayatAbsensi = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h2 className="text-xl font-bold mb-4">Riwayat Absensi</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Keterangan</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.tanggal}</td>

              <td className="border p-2">{item.status}</td>

              <td className="border p-2">{item.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatAbsensi;
