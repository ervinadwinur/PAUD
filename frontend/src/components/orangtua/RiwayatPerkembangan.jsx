const RiwayatPerkembangan = ({ perkembangan }) => {
  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h2 className="text-xl font-bold mb-4">Riwayat Perkembangan Anak</h2>

      <div className="space-y-4">
        {perkembangan.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold">{item.tanggal}</h3>

            <p>
              <strong>Motorik :</strong> {item.motorik}
            </p>

            <p>
              <strong>Kognitif :</strong> {item.kognitif}
            </p>

            <p>
              <strong>Sosial :</strong> {item.sosial}
            </p>

            <p>
              <strong>Catatan Guru :</strong>
            </p>

            <p>{item.catatan}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiwayatPerkembangan;
