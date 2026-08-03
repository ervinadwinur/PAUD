import api from "./api";

const siswaService = {
  getAll(params) {
    return api.get("/siswa", { params });
  },

  getById(id) {
    return api.get(`/siswa/${id}`);
  },
};

export default siswaService;