import api from "./api";

const getByKelas = async (kelasId) => {
  const response = await api.get("/kegiatan-harian", { params: { kelasId } });
  return response.data.data;
};

const kegiatanHarianService = { getByKelas };

export default kegiatanHarianService;