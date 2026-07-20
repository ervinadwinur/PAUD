const ProfilAnak = ({ anak }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-5">
        <img
          src={anak.foto}
          alt={anak.nama}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold">{anak.nama}</h2>

          <p>NIS : {anak.nis}</p>

          <p>Kelas : {anak.kelas}</p>

          <p>Jenis Kelamin : {anak.jenisKelamin}</p>

          <p>Tanggal Lahir : {anak.tanggalLahir}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilAnak;
