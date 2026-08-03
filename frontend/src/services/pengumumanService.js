// src/services/pengumumanService.js
import api from "./api";

const getAll = async () => {
  const response = await api.get("/pengumuman");
  return response.data.data;
};

const pengumumanService = { getAll };

export default pengumumanService;