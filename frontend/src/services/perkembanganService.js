import api from "./api";

const getBySiswa = async (siswaId) => {
  const response = await api.get("/perkembangan", { params: { siswaId } });
  return response.data.data;
};

const perkembanganService = { getBySiswa };

export default perkembanganService;