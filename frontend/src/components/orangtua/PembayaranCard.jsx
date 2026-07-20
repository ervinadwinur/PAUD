const PembayaranCard = ({ pembayaran }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border">
      <h2 className="text-lg font-semibold mb-3">Informasi Pembayaran</h2>

      <div className="space-y-2">
        <p>
          <strong>Bulan :</strong> {pembayaran.bulan}
        </p>

        <p>
          <strong>Nominal :</strong> Rp{" "}
          {Number(pembayaran.nominal).toLocaleString("id-ID")}
        </p>

        <p>
          <strong>Status :</strong>

          <span
            className={`ml-2 px-2 py-1 rounded text-white ${
              pembayaran.status === "Lunas" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {pembayaran.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PembayaranCard;
